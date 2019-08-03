package kr.di.uoa.gr.jedaiwebapp.utilities;

import java.time.LocalTime;
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
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter.SseEventBuilder;

import gnu.trove.map.TObjectIntMap;
import kr.di.uoa.gr.jedaiwebapp.models.DataReadModel;

public class WorkflowManager {
	
	public static  String er_mode;
	public static List<EntityProfile> profilesD1;
	public static List<EntityProfile> profilesD2;
	public static AbstractDuplicatePropagation ground_truth;

	public static ISchemaClustering schema_clustering;
	public static IBlockProcessing comparison_cleaning;
	public static IEntityMatching entity_matching;
	public static IEntityClustering entity_clustering;
	public static List<IBlockBuilding> block_building;
	public static List<IBlockProcessing> block_cleaning;
	
	private static EquivalenceCluster[] entityClusters;
	
	

	
	

	
	WorkflowManager(){
		WorkflowManager.er_mode = null;
		WorkflowManager.profilesD1 = null;
		WorkflowManager.profilesD2 = null;
		WorkflowManager.ground_truth = null;
		WorkflowManager.schema_clustering = null;
		WorkflowManager.comparison_cleaning = null;
		WorkflowManager.entity_matching = null;
		WorkflowManager.entity_clustering = null;
		WorkflowManager.block_building = null;
		WorkflowManager.block_cleaning = null;
		
	}
	
	
	
	
	
	public static ClustersPerformance runWorkflow(boolean final_run)  throws Exception {
		 
		
		
		SseEmitter emitter = new SseEmitter();
		 SseEventBuilder event = SseEmitter.event()
                 .data("SSE MVC - " + LocalTime.now().toString())
                 .name("SSE");
		 emitter.send(event);
		 Thread.sleep(1000);
		 event = SseEmitter.event()
                 .data("SSE MVC - " + LocalTime.now().toString())
                 .name("SSE");
		 emitter.send(event);
		 
		// TODO: if final_run write "Running schema clustering..."
		
		
		 
		 TObjectIntMap<String>[] clusters = null;
        if (schema_clustering != null) {
            // Run schema clustering
            if (er_mode.equals(JedaiOptions.DIRTY_ER)) {
                clusters = schema_clustering.getClusters(profilesD1);
            } else {
                clusters = schema_clustering.getClusters(profilesD1, profilesD2);
            }
        }
        
        // Initialize a few variables
        double overheadStart;
        double overheadEnd;
        BlocksPerformance blp;

        // TODO: if final_run write "Running block building..."
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
                double totalTime = overheadEnd - overheadStart;

                //TODO: Print performance
                //blp.printStatistics(totalTime, bb.getMethodConfiguration(), bb.getMethodName());

                // Save the performance of block building
                //TODO: Store the results in a Model 
                //this.addBlocksPerformance(bb.getMethodName(), totalTime, blp);
            }
        }
        
        //TODO: if final_run write "Original blocks\t:\t" + blocks.size() 

        // Run Block Cleaning
        if (final_run)
        	//TODO: if final_run write "Running block cleaning..."

        if (block_cleaning != null && !block_cleaning.isEmpty()) {
            // Execute the methods
            for (IBlockProcessing currentMethod : block_cleaning) {
                blocks = runBlockProcessing(ground_truth, final_run, blocks, currentMethod);

                if (blocks.isEmpty()) {
                    return null;
                }
            }
        }

        // Run Comparison Cleaning
        //TODO: if final_run write "Running comparison cleaning..."
        
        if (comparison_cleaning != null) {
            blocks = runBlockProcessing(ground_truth, final_run, blocks, comparison_cleaning);

            if (blocks.isEmpty()) {
                return null;
            }
        }

        // Run Entity Matching
        //TODO: if final_run write"Running entity matching..."
        
        SimilarityPairs simPairs;

        if (entity_matching == null)
            throw new Exception("Entity Matching method is null!");

        if (er_mode.equals(JedaiOptions.DIRTY_ER)) 
            simPairs = entity_matching.executeComparisons(blocks, profilesD1);
        else 
            simPairs = entity_matching.executeComparisons(blocks, profilesD1, profilesD2);
        

        // Run Entity Clustering
        //TODO: if final_run write "Running entity clustering..."
        
        overheadStart = System.currentTimeMillis();

        entityClusters = entity_clustering.getDuplicates(simPairs);

        // Print clustering performance
        overheadEnd = System.currentTimeMillis();
        ClustersPerformance clp = new ClustersPerformance(entityClusters, ground_truth);
        
        //TODO: Print statistics 
        //
        //clp.setStatistics();        
        //if (final_run)
        //    clp.printStatistics(overheadEnd - overheadStart, entity_clustering.getMethodName(),
        //    		entity_clustering.getMethodConfiguration());

        return clp;
        
	}
	
	
	
	
	
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

                double totalTime = overheadEnd - overheadStart;
                blp.printStatistics(totalTime, currentMethod.getMethodConfiguration(),
                        currentMethod.getMethodName());

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
