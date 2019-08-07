package kr.di.uoa.gr.jedaiwebapp.utilities;


import java.util.ArrayList;
import java.util.List;

import org.scify.jedai.blockbuilding.IBlockBuilding;
import org.scify.jedai.blockprocessing.IBlockProcessing;
import org.scify.jedai.datamodel.AbstractBlock;
import org.scify.jedai.datamodel.EntityProfile;
import org.scify.jedai.datamodel.EquivalenceCluster;
import org.scify.jedai.datamodel.SimilarityPairs;
import org.scify.jedai.entityclustering.IEntityClustering;
import org.scify.jedai.entitymatching.IEntityMatching;
import org.scify.jedai.schemaclustering.ISchemaClustering;
import org.scify.jedai.utilities.BlocksPerformance;
import org.scify.jedai.utilities.ClustersPerformance;
import org.scify.jedai.utilities.datastructures.AbstractDuplicatePropagation;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import gnu.trove.map.TObjectIntMap;
import kr.di.uoa.gr.jedaiwebapp.utilities.events.EventPublisher;

public class WorkflowManager {
	
	public static  String er_mode = null;
	public static List<EntityProfile> profilesD1 = null;
	public static List<EntityProfile> profilesD2 = null;
	public static AbstractDuplicatePropagation ground_truth = null;

	public static ISchemaClustering schema_clustering = null;
	public static IBlockProcessing comparison_cleaning = null;
	public static IEntityMatching entity_matching = null;
	public static IEntityClustering entity_clustering = null;
	public static List<IBlockBuilding> block_building = null;
	public static List<IBlockProcessing> block_cleaning = null;
	
	private static EquivalenceCluster[] entityClusters = null;
	
	private static EventPublisher eventPublisher;
	private static WorkflowDetailsManager details_manager ;
	


	
	
	@Bean
	EventPublisher publisherBean () {
        return new EventPublisher();
    }
	
	@Bean
	SSE_Manager SSE_ManagerBean () {
		return new SSE_Manager();
	}
	
	
	/**
	 * Run a workflow with the given methods and return its ClustersPerformance
	 *
	 * @param final_run true if this is the final run
	 * @return  the Cluster Performance
	 * */
	public static ClustersPerformance runWorkflow(boolean final_run)  throws Exception {
		 
		String event_name="execution_step";
		AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(WorkflowManager.class);
		eventPublisher = context.getBean(EventPublisher.class);
		details_manager = new WorkflowDetailsManager();
		
		// Print profile entities statistics
		if(er_mode.equals(JedaiOptions.DIRTY_ER))
			details_manager.print_Sentence("Input Entity Profiles", profilesD1.size());
		else {
			details_manager.print_Sentence("Input Entity Profiles 1", profilesD1.size());
			details_manager.print_Sentence("Input Entity Profiles 2", profilesD2.size());
		}
		details_manager.print_Sentence("Existing Duplicates", ground_truth.getDuplicates().size());
		 
		
		// Run Schema Clustering
		TObjectIntMap<String>[] clusters = null;
        if (schema_clustering != null) {
        	if(final_run) 
    			eventPublisher.publish("Schema Clustering", event_name);
    		
            if (er_mode.equals(JedaiOptions.DIRTY_ER)) {
                clusters = schema_clustering.getClusters(profilesD1);
            } else {
                clusters = schema_clustering.getClusters(profilesD1, profilesD2);
            }
        }
        
        
        // run Block Building
        double overheadStart;
        double overheadEnd;
        BlocksPerformance blp;

        if(final_run) 
			eventPublisher.publish("Block Building", event_name);
        
        List<AbstractBlock> blocks = new ArrayList<>();
        for (IBlockBuilding bb : block_building) {
            // Start time measurement
            overheadStart = System.currentTimeMillis();

            // Run the method
            blocks.addAll(runBlockBuilding(er_mode, clusters, profilesD1, profilesD2, bb));

            // Get blocks performance to print
            overheadEnd = System.currentTimeMillis();
            blp = new BlocksPerformance(blocks, ground_truth);
            blp.setStatistics();
            
            if (final_run) {
                // print block Building performance
                details_manager.print_BlockBuildingPerformance(blp, 
                		overheadEnd - overheadStart, 
                		bb.getMethodConfiguration(), 
                		bb.getMethodName());
                
                // Save the performance of block building
                //TODO: Store the results in a Model 
                //this.addBlocksPerformance(bb.getMethodName(), totalTime, blp);
            }
        }
        
        if(final_run)
        	details_manager.print_Sentence("Original blocks\t:\t", blocks.size()); 

        
        // Run Block Cleaning
        if (block_cleaning != null && !block_cleaning.isEmpty()) {
            if(final_run) 
    			eventPublisher.publish("Block Cleaning", event_name);
            
            // Execute the methods
            for (IBlockProcessing currentMethod : block_cleaning) {
                blocks = runBlockProcessing(ground_truth, final_run, blocks, currentMethod);

                if (blocks.isEmpty()) {
                    return null;
                }
            }
        }

        // Run Comparison Cleaning     
        if (comparison_cleaning != null) {
        	if(final_run) 
    			eventPublisher.publish("Comparison Cleaning", event_name);
    		
            blocks = runBlockProcessing(ground_truth, final_run, blocks, comparison_cleaning);

            if (blocks.isEmpty()) {
                return null;
            }
        }

        
        // Run Entity Matching
        SimilarityPairs simPairs;
        if (entity_matching == null)
            throw new Exception("Entity Matching method is null!");
                
        if(final_run) 
			eventPublisher.publish("Entity Matching", event_name);
		
        if (er_mode.equals(JedaiOptions.DIRTY_ER)) 
            simPairs = entity_matching.executeComparisons(blocks, profilesD1);
        else 
            simPairs = entity_matching.executeComparisons(blocks, profilesD1, profilesD2);
        

        // Run Entity Clustering
        if(final_run) 
			eventPublisher.publish("Entity Clustering", event_name);
        
        overheadStart = System.currentTimeMillis();

        entityClusters = entity_clustering.getDuplicates(simPairs);

        // Print clustering performance
        overheadEnd = System.currentTimeMillis();
        ClustersPerformance clp = new ClustersPerformance(entityClusters, ground_truth);
        clp.setStatistics();        
        if (final_run)
        	details_manager.print_ClustersPerformance(clp, 
        			overheadEnd - overheadStart, 
        			entity_clustering.getMethodName(), 
        			entity_clustering.getMethodConfiguration());

        
        return clp;
        
	}
	
	
	
	
	/**
     * Run a step by step workflow, using random or grid search based on the given parameter.
     *
     * @param random      If true, will use random search. Otherwise, grid.
     * @return ClustersPerformance of the workflow result
     */
	public static ClustersPerformance runStepByStepWorkflow(boolean random) throws Exception{
		return null;
	}
	
	
	
	
	
	
	
	  /**
     * Run a block building method and return its blocks
     *
     * @param erType     Entity Resolution type
     * @param clusters   Clusters from schema clustering, if applicable (can be null)
     * @param profilesD1 List of profiles from the 1st dataset
     * @param profilesD2 List of profiles from the 2nd dataset
     * @param bb         Block building method instance to get blocks with
     * @return List of blocks generated by block building method
     */
    private static List<AbstractBlock> runBlockBuilding(String erType, TObjectIntMap<String>[] clusters,
                                                 List<EntityProfile> profilesD1, List<EntityProfile> profilesD2,
                                                 IBlockBuilding bb) {
        if (erType.equals(JedaiOptions.DIRTY_ER)) {
            if (clusters == null) {
                // Dirty ER without schema clustering
                return bb.getBlocks(profilesD1);
            } else {
                // Dirty ER with schema clustering
                return bb.getBlocks(profilesD1, null, clusters);
            }
        } else {
            if (clusters == null) {
                // Clean-clean ER without schema clustering
                return bb.getBlocks(profilesD1, profilesD2);
            } else {
                // Clean-clean ER with schema clustering
                return bb.getBlocks(profilesD1, profilesD2, clusters);
            }
        }
    }
    
    
    
    /**
     * Process blocks using a given block processing method
     *
     * @param duProp        Duplicate propagation (from ground-truth)
     * @param finalRun      Set to true to print clusters performance
     * @param blocks        Blocks to process
     * @param currentMethod Method to process the blocks with
     * @return Processed list of blocks
     */
    private static List<AbstractBlock> runBlockProcessing(AbstractDuplicatePropagation duProp, boolean finalRun,
                                                   List<AbstractBlock> blocks, IBlockProcessing currentMethod) {
        double overheadStart;
        double overheadEnd;
        BlocksPerformance blp;
        overheadStart = System.currentTimeMillis();

        if (!blocks.isEmpty()) {
            blocks = currentMethod.refineBlocks(blocks);
            overheadEnd = System.currentTimeMillis();

            if (finalRun) {
                // Print blocks performance
                blp = new BlocksPerformance(blocks, duProp);
                blp.setStatistics();
                details_manager.print_BlockBuildingPerformance(blp, overheadEnd - overheadStart, currentMethod.getMethodConfiguration(),  currentMethod.getMethodName());
                
                // Save the performance of block processing
                //TODO: this.addBlocksPerformance(currentMethod.getMethodName(), totalTime, blp);
            }
        }

        return blocks;
    }
	
	
	
	
	
	public static String getEr_mode() {
		return er_mode;
	}

	public static void setEr_mode(String er_mode) {
		WorkflowManager.er_mode = er_mode;
	}

	public static List<EntityProfile> getProfilesD1() {
		return profilesD1;
	}

	public static void setProfilesD1(List<EntityProfile> profilesD1) {
		WorkflowManager.profilesD1 = profilesD1;
	}

	public static List<EntityProfile> getProfilesD2() {
		return profilesD2;
	}

	public static void setProfilesD2(List<EntityProfile> profilesD2) {
		WorkflowManager.profilesD2 = profilesD2;
	}

	public static AbstractDuplicatePropagation getGround_truth() {
		return ground_truth;
	}

	public static void setGround_truth(AbstractDuplicatePropagation ground_truth) {
		WorkflowManager.ground_truth = ground_truth;
	}

	public static ISchemaClustering getSchema_clustering() {
		return schema_clustering;
	}

	public static void setSchema_clustering(ISchemaClustering schema_clustering) {
		WorkflowManager.schema_clustering = schema_clustering;
	}

	public static IBlockProcessing getComparison_cleaning() {
		return comparison_cleaning;
	}

	public static void setComparison_cleaning(IBlockProcessing comparison_cleaning) {
		WorkflowManager.comparison_cleaning = comparison_cleaning;
	}

	public static IEntityMatching getEntity_matching() {
		return entity_matching;
	}

	public static void setEntity_matching(IEntityMatching entity_matching) {
		WorkflowManager.entity_matching = entity_matching;
	}

	public static IEntityClustering getEntity_clustering() {
		return entity_clustering;
	}

	public static void setEntity_clustering(IEntityClustering entity_clustering) {
		WorkflowManager.entity_clustering = entity_clustering;
	}

	public static List<IBlockBuilding> getBlock_building() {
		return block_building;
	}

	public static void setBlock_building(List<IBlockBuilding> block_building) {
		WorkflowManager.block_building = block_building;
	}

	public static List<IBlockProcessing> getBlock_cleaning() {
		return block_cleaning;
	}

	public static void setBlock_cleaning(List<IBlockProcessing> block_cleaning) {
		WorkflowManager.block_cleaning = block_cleaning;
	}
	
	
	
	
}
