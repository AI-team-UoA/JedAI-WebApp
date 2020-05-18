package kr.di.uoa.gr.jedaiwebapp.utilities.workflows;


import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

import org.javatuples.Pair;
import org.javatuples.Triplet;
import org.scify.jedai.blockbuilding.IBlockBuilding;
import org.scify.jedai.blockprocessing.IBlockProcessing;
import org.scify.jedai.datamodel.AbstractBlock;
import org.scify.jedai.datamodel.AttributeClusters;
import org.scify.jedai.datamodel.Comparison;
import org.scify.jedai.datamodel.EquivalenceCluster;
import org.scify.jedai.datamodel.SimilarityPairs;
import org.scify.jedai.entityclustering.IEntityClustering;
import org.scify.jedai.entitymatching.IEntityMatching;
import org.scify.jedai.prioritization.IPrioritization;
import org.scify.jedai.schemaclustering.ISchemaClustering;
import org.scify.jedai.utilities.BlocksPerformance;
import org.scify.jedai.utilities.ClustersPerformance;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;

import kr.di.uoa.gr.jedaiwebapp.datatypes.MethodModel;
import kr.di.uoa.gr.jedaiwebapp.datatypes.WorkflowResult;
import kr.di.uoa.gr.jedaiwebapp.utilities.BlockUtils;
import kr.di.uoa.gr.jedaiwebapp.utilities.SSE_Manager;
import kr.di.uoa.gr.jedaiwebapp.utilities.WorkflowDetailsManager;
import kr.di.uoa.gr.jedaiwebapp.utilities.WorkflowManager;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.DynamicMethodConfiguration;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.JedaiOptions;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.MethodConfigurations;
import kr.di.uoa.gr.jedaiwebapp.utilities.events.EventPublisher;

public class ProgressiveWF {

    public static ISchemaClustering schema_clustering = null;
	public static IBlockProcessing comparison_cleaning = null;
	public static IEntityMatching entity_matching = null;
    public static IEntityClustering entity_clustering = null;
	public static List<IBlockBuilding> block_building = null;
    public static List<IBlockProcessing> block_cleaning = null;
	public static IPrioritization prioritization = null;
	public static MethodModel prioritizationModel = null;
    
    private static WorkflowDetailsManager details_manager ;
	private static EventPublisher eventPublisher;

	public static List<Integer> recallIterations;
	public static List<Double> recallCurve;
	public static List<WorkflowResult> performancePerStep;

    @Bean
	EventPublisher publisherBean () {
        return new EventPublisher();
    }
	
	@Bean
	SSE_Manager SSE_ManagerBean () {
		return new SSE_Manager();
    }
    
    /**
	 * check if execution was interrupted
	 */
	public static boolean interrupt(AtomicBoolean interrupted){
		//the process was stopped by the user
		if (interrupted.get()) {
			eventPublisher.publish("", "execution_step");
			return true;
		}
		else return false;
    }
    
    public static void clean(){

		schema_clustering = null;
		comparison_cleaning = null;
		entity_matching = null;
		entity_clustering = null;
		block_building = null;
		block_cleaning = null;
		prioritizationModel=null;
        prioritization = null;
    }


    public static boolean configurationOk(){
		return entity_matching != null && entity_clustering != null && block_building != null && !block_building.isEmpty()
		&& (prioritizationModel != null || prioritization !=null) ;
    }













	/**
	 * Run a workflow with the given methods and return its ClustersPerformance
	 *
	 * @param final_run true if this is the final run
	 * @return  the Cluster Performance and the performances of each step
	 * */
	public static Pair<ClustersPerformance, List<Triplet<String, BlocksPerformance, Double>>>
	run(boolean final_run, AtomicBoolean interrupted)  {
		AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(BlockingWF.class);

		performancePerStep = new ArrayList<>(); 
		recallIterations = new ArrayList<>();
		recallCurve = new ArrayList<>();

		try {	
					
			List<Triplet<String, BlocksPerformance, Double>> performances = new ArrayList<>();
			
			String event_name="execution_step";
			eventPublisher = context.getBean(EventPublisher.class);
			details_manager = new WorkflowDetailsManager();
			
			if(!final_run)
				eventPublisher.publish("Processing Automatic Configurations", event_name);
			
			// Print profile entities statistics
			if(final_run) {
				if(WorkflowManager.er_mode.equals(JedaiOptions.DIRTY_ER))
					details_manager.print_Sentence("Input Entity Profiles", WorkflowManager.profilesD1.size());
				else {
					details_manager.print_Sentence("Input Entity Profiles 1", WorkflowManager.profilesD1.size());
					details_manager.print_Sentence("Input Entity Profiles 2", WorkflowManager.profilesD2.size());
				}
				details_manager.print_Sentence("Existing Duplicates", WorkflowManager.ground_truth.getDuplicates().size());
			}
			
			if (interrupt(interrupted)) {
				context.close();
				return null;
            }
            
			// Run Schema Clustering
			AttributeClusters[] clusters = null;
	        if (schema_clustering != null) {
	        	if(final_run) 
	    			eventPublisher.publish("Schema Clustering", event_name);
	    		
	            if (WorkflowManager.er_mode.equals(JedaiOptions.DIRTY_ER)) {
	                clusters = schema_clustering.getClusters(WorkflowManager.profilesD1);
	            } else {
	                clusters = schema_clustering.getClusters(WorkflowManager.profilesD1, WorkflowManager.profilesD2);
	            }
	        }
            
            if (interrupt(interrupted)) {
				context.close();
				return null;
			}
	        	        
			double overheadStart;
	        double overheadEnd;
			BlocksPerformance blp;
			List<AbstractBlock> blocks = new ArrayList<>();
	
			if (block_building != null && !block_building.isEmpty()){
				// run Block Building
				if(final_run) 
					eventPublisher.publish("Block Building", event_name);
				
				for (IBlockBuilding bb : block_building) {

					// Start time measurement
					overheadStart = System.currentTimeMillis();
		
					// Run the method
					blocks.addAll(BlockUtils.runBlockBuilding(WorkflowManager.er_mode, clusters, WorkflowManager.profilesD1, WorkflowManager.profilesD2, bb));
		
					// Get blocks performance to print
					overheadEnd = System.currentTimeMillis();
					blp = new BlocksPerformance(blocks, WorkflowManager.ground_truth);
					blp.setStatistics();
					
					if (final_run) {
						// print block Building performance
						details_manager.print_BlockBuildingPerformance(blp, 
								(overheadEnd - overheadStart)/1000, 
								bb.getMethodConfiguration(), 
								bb.getMethodName());
						performances.add(new Triplet<>(bb.getMethodName(), blp, (overheadEnd - overheadStart)/1000));
					}
					if (interrupt(interrupted)) {
						context.close();
						return null;
					}
				}

				if(final_run)
	        		details_manager.print_Sentence("Original blocks\t:\t", blocks.size()); 
			}
	        
	
	        
	        // Run Block Cleaning
	        if (block_cleaning != null && !block_cleaning.isEmpty() && !blocks.isEmpty()) {
	        	
	            if(final_run) 
	    			eventPublisher.publish("Block Cleaning", event_name);
	            
	            // Execute the methods
	            for (IBlockProcessing currentMethod : block_cleaning) {
	            	
	            	overheadStart = System.currentTimeMillis();
	            	
	                Triplet<List<AbstractBlock>, BlocksPerformance, Double> p = BlockUtils.runBlockProcessing(WorkflowManager.ground_truth, final_run, blocks, currentMethod, details_manager);
	                blocks = p.getValue0();
	                if (final_run)
	                	performances.add(new Triplet<>(currentMethod.getMethodName(), p.getValue1(), p.getValue2()));
		            
	                if (blocks.isEmpty()) {
                        context.close();
	                    return null;
					}
					
					if (interrupt(interrupted)) {
						context.close();
						return null;
					}
	            }
	        }
	
	        // Run Comparison Cleaning     
	        if (comparison_cleaning != null && !blocks.isEmpty()) {
	        	if(final_run) 
	    			eventPublisher.publish("Comparison Cleaning", event_name);					
        
				Triplet<List<AbstractBlock>, BlocksPerformance, Double> p = BlockUtils.runBlockProcessing(WorkflowManager.ground_truth, final_run, blocks, comparison_cleaning, details_manager);
				blocks = p.getValue0();
				if (final_run)
                	performances.add(new Triplet<>(comparison_cleaning.getMethodName(), p.getValue1(), p.getValue2()));
				
	            if (blocks.isEmpty()) {
                    context.close();
	                return null;
				}
				
				if (interrupt(interrupted)) {
                    context.close();
                    return null;
                }
			}

			eventPublisher.publish("Prioritization", event_name);					

			double originalRecall = 0;
			// If we have blocks, run an initial entity matching/clustering before the similarity matching
			if (!blocks.isEmpty()) {
				// Entity matching
				SimilarityPairs originalSims = entity_matching.executeComparisons(blocks);
				details_manager.print_Sentence("Executed comparisons\t:\t" + originalSims.getNoOfComparisons());

				if (interrupt(interrupted)) {
                    context.close();
                    return null;
                }
	
				// Entity clustering
				overheadStart = System.currentTimeMillis();
				EquivalenceCluster[] originalClusters = entity_clustering.getDuplicates(originalSims);
				overheadEnd = System.currentTimeMillis();
	
				// Get original recall
				ClustersPerformance clp = new ClustersPerformance(originalClusters, WorkflowManager.ground_truth);
				clp.setStatistics();
				details_manager.print_ClustersPerformance(clp, 
	        			(overheadEnd - overheadStart)/1000, 
	        			entity_clustering.getMethodName(), 
	        			entity_clustering.getMethodConfiguration());
	
				originalRecall = clp.getRecall();

				if (interrupt(interrupted)) {
                    context.close();
                    return null;
                }
			}

			// Prioritization
			overheadStart = System.currentTimeMillis();
			boolean isDirtyEr = WorkflowManager.er_mode.equals(JedaiOptions.DIRTY_ER);
	
			// Calculate total comparisons, if applicable
			double totalComparisons = 0;
			if (!blocks.isEmpty()) {
				totalComparisons = BlockUtils.getTotalComparisons(blocks);
			}
			details_manager.print_Sentence("Total comparisons\t:\t" + totalComparisons);
	
			
			// Calculate the budget/comparisons here
			long budget;
	
			if (blocks.isEmpty()) {
				// No blocks, calculate budget based on entity profiles
				budget = isDirtyEr ?
						(WorkflowManager.profilesD1.size() * (WorkflowManager.profilesD1.size() - 1) / 2) :
						(WorkflowManager.profilesD1.size() * WorkflowManager.profilesD2.size());
				
			} else {
				// Use number of comparisons from blocks as budget
				budget = (long) totalComparisons;
			}
	
			// Create instance of prioritization method
			setPrioritization(budget);
			details_manager.print_Sentence("Prioritization budget: " + prioritization.getMethodParameters()); // TODO print budget and ws

	
			// Run prioritization
			if (!blocks.isEmpty()) {
				// Block-based schedule (there were block building methods selected)
				prioritization.developBlockBasedSchedule(blocks);
			} else {
				// Entity-based schedule (directly with input entities!)
				if (isDirtyEr) {
					// Dirty ER
					prioritization.developEntityBasedSchedule(WorkflowManager.profilesD1);
				} else {
					// Clean-Clean ER
					prioritization.developEntityBasedSchedule(WorkflowManager.profilesD1, WorkflowManager.profilesD2);
				}
			}

			if (interrupt(interrupted)) {
				context.close();
				return null;
			}

			 // Entity Matching
			eventPublisher.publish("Entity Matching", event_name);					

			SimilarityPairs sims = new SimilarityPairs(
					 !isDirtyEr,
					 (int) ((!blocks.isEmpty() && !isDirtyEr) ? totalComparisons : budget)
			);
	 
			ClustersPerformance clp = null;
			while (prioritization.hasNext()) {
				if (interrupt(interrupted)) {
                    context.close();
                    return null;
                }
				// Get the comparison
				Comparison comparison = prioritization.next();
	 
				// Calculate the similarity
				double similarity = entity_matching.executeComparison(comparison);
				comparison.setUtilityMeasure(similarity);
	 
				sims.addComparison(comparison);

	 
				 // Run clustering
				 EquivalenceCluster[] entityClusters = entity_clustering.getDuplicates(sims);
	 
				 // Calculate new clusters performance
				 clp = new ClustersPerformance(entityClusters, WorkflowManager.ground_truth);
				 clp.setStatistics();
	 
				 double recall = clp.getRecall();
	 
				 // Add current recall to the list
				 recallCurve.add(recall);
	 
				 // If we reached the original recall, stop
				 if (originalRecall <= recall) {
					 break;
				 }
			}
			overheadEnd = System.currentTimeMillis();


			// Print clustering performance
			if (clp != null) {
				details_manager.print_ClustersPerformance(clp, 
						(overheadEnd - overheadStart)/1000, 
						entity_clustering.getMethodName(), 
						entity_clustering.getMethodConfiguration());
	
				// Add prioritization performance step for workbench
				performancePerStep.add(
						new WorkflowResult(
								prioritization.getMethodName(),
								clp.getRecall(),
								clp.getPrecision(),
								clp.getFMeasure(),
								(overheadEnd - overheadStart) / 1000.0,
								-1,
								clp.getEntityClusters(),
								-1
						)
				);
			} else {
				// Add prioritization performance step for workbench without clustering values
				performancePerStep.add(
						new WorkflowResult(prioritization.getMethodName(), -1, -1, -1, (overheadEnd - overheadStart) / 1000.0, -1, -1, -1)
				);
			}
	
			// Create recallIterations
			int maxPoints = 500;
			List<Integer> recallIterations;
			if (recallCurve.size() > maxPoints) {
				// Needs undersampling
				List<Double> newPoints = new ArrayList<>(maxPoints);
				recallIterations = new ArrayList<>(maxPoints);
	
				int step = recallCurve.size() / maxPoints;
				for (int i = 0; i < maxPoints; i++) {
					newPoints.add(recallCurve.get(i * step));
					recallIterations.add(i * step);
				}
	
				recallCurve = newPoints;
			} else {
				// Add iterations from 1 to recallCurve.size()
				recallIterations = new ArrayList<>(recallCurve.size());
	
				for (int i = 1; i <= recallCurve.size(); i++) {
					recallIterations.add(i);
				}
			}

			context.close();
			return new Pair<>(clp, performances);
	
		}
		catch(Exception e) {
			e.printStackTrace();
			WorkflowManager.setErrorMessage(e.getMessage());
			context.close();
			return null;
		}

	}



	public static void addBlockBuilding(IBlockBuilding bb){
        if (block_building == null)
            block_building = new ArrayList<>();

        block_building.add(bb);
    }

    public static void addBlockCleaning(IBlockProcessing bc){
        if (block_cleaning == null)
            block_cleaning = new ArrayList<>();

        block_cleaning.add(bc);
    }
    
    public static ISchemaClustering getSchema_clustering() {
        return schema_clustering;
    }

    public static void setSchema_clustering(ISchemaClustering sc) {
        schema_clustering = sc;
    }

    public static IBlockProcessing getComparison_cleaning() {
        return comparison_cleaning;
    }

    public static void setComparison_cleaning(IBlockProcessing cc) {
        comparison_cleaning = cc;
    }

    public static IEntityMatching getEntity_matching() {
        return entity_matching;
    }

    public static void setEntity_matching(IEntityMatching em) {
        entity_matching = em;
    }

    public static IEntityClustering getEntity_clustering() {
        return entity_clustering;
    }

    public static void setEntity_clustering(IEntityClustering ec) {
        entity_clustering = ec;
    }

    public static List<IBlockBuilding> getBlock_building() {
        return block_building;
    }

    public static void setBlock_building(List<IBlockBuilding> bb) {
        block_building = bb;
    }

    public static List<IBlockProcessing> getBlock_cleaning() {
        return block_cleaning;
    }

    public static void setBlock_cleaning(List<IBlockProcessing> bc) {
        block_cleaning = bc;
	}

	public static IPrioritization getPrioritization() {
        return prioritization;
    }

    public static void setPrioritization(IPrioritization p) {
        prioritization = p;
	}
	
	public static MethodModel getPrioritizationModel() {
        return prioritizationModel;
    }

    public static void setPrioritizationModel(MethodModel p) {
        prioritizationModel = p;
	}
	

	public static void setPrioritization(long budget){
		if (!prioritizationModel.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) {
			// Create method instance with default configuration
			prioritization = MethodConfigurations.getPrioritizationMethodByName(
					prioritizationModel.getLabel(),
					(int) budget
			);
		} else {
			// Manual configuration selected, create method with the saved parameters
			prioritization = DynamicMethodConfiguration.configurePrioritizationMethod(
					prioritizationModel.getLabel(),
					prioritizationModel.getParameters()
			);
		}
	}

	public static List<Double> getRecalls(){
		return recallCurve;
	}
	
}