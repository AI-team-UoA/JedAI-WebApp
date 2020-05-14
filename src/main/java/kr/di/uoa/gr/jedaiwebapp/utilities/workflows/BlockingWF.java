package kr.di.uoa.gr.jedaiwebapp.utilities.workflows;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

import org.javatuples.Pair;
import org.javatuples.Triplet;
import org.scify.jedai.blockbuilding.IBlockBuilding;
import org.scify.jedai.blockprocessing.IBlockProcessing;
import org.scify.jedai.datamodel.AbstractBlock;
import org.scify.jedai.datamodel.AttributeClusters;
import org.scify.jedai.datamodel.EquivalenceCluster;
import org.scify.jedai.datamodel.SimilarityPairs;
import org.scify.jedai.entityclustering.IEntityClustering;
import org.scify.jedai.entitymatching.IEntityMatching;
import org.scify.jedai.schemaclustering.ISchemaClustering;
import org.scify.jedai.utilities.BlocksPerformance;
import org.scify.jedai.utilities.ClustersPerformance;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;

import kr.di.uoa.gr.jedaiwebapp.datatypes.MethodModel;
import kr.di.uoa.gr.jedaiwebapp.utilities.BlockUtils;
import kr.di.uoa.gr.jedaiwebapp.utilities.SSE_Manager;
import kr.di.uoa.gr.jedaiwebapp.utilities.WorkflowDetailsManager;
import kr.di.uoa.gr.jedaiwebapp.utilities.WorkflowManager;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.JedaiOptions;
import kr.di.uoa.gr.jedaiwebapp.utilities.events.EventPublisher;

public class BlockingWF {

	public static ISchemaClustering schema_clustering = null;
	public static IBlockProcessing comparison_cleaning = null;
	public static IEntityMatching entity_matching = null;
    public static IEntityClustering entity_clustering = null;
	public static List<IBlockBuilding> block_building = null;
	public static List<IBlockProcessing> block_cleaning = null;
    
    
    private static WorkflowDetailsManager details_manager ;
	private static EventPublisher eventPublisher;

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
    }


    public static boolean configurationOk(){
        return entity_matching != null && entity_clustering != null && block_building != null && !block_building.isEmpty() ;
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
	
	        // run Block Building
	        if(final_run) 
				eventPublisher.publish("Block Building", event_name);
	        
	        List<AbstractBlock> blocks = new ArrayList<>();
	        for (IBlockBuilding bb : block_building) {
				
				if (interrupt(interrupted)) {
                    context.close();
                    return null;
                }

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
	        }
	        
	        if(final_run)
	        	details_manager.print_Sentence("Original blocks\t:\t", blocks.size()); 
	
	        
	        // Run Block Cleaning
	        if (block_cleaning != null && !block_cleaning.isEmpty()) {
                
                if (interrupt(interrupted)) {
                    context.close();
                    return null;
                }
	        	
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
	            }
	        }
	
	        // Run Comparison Cleaning     
	        if (comparison_cleaning != null) {
	        	if(final_run) 
	    			eventPublisher.publish("Comparison Cleaning", event_name);
            
                if (interrupt(interrupted)) {
                    context.close();
                    return null;
                }					
        
				Triplet<List<AbstractBlock>, BlocksPerformance, Double> p = BlockUtils.runBlockProcessing(WorkflowManager.ground_truth, final_run, blocks, comparison_cleaning, details_manager);
				blocks = p.getValue0();
				if (final_run)
                	performances.add(new Triplet<>(comparison_cleaning.getMethodName(), p.getValue1(), p.getValue2()));
				
	            if (blocks.isEmpty()) {
                    context.close();
	                return null;
	            }
	        }
	
	        
	        // Run Entity Matching
	        SimilarityPairs simPairs;
	        if (entity_matching == null){
                context.close();
                throw new Exception("Entity Matching method is null!");
            }
	                
	        if(final_run) 
				eventPublisher.publish("Entity Matching", event_name);
	        
            if (interrupt(interrupted)) {
                context.close();
                return null;
            }
			overheadStart = System.currentTimeMillis();
			
			simPairs = entity_matching.executeComparisons(blocks);
	        
	        overheadEnd = System.currentTimeMillis();
	        if(final_run) {
	        	String msg = "Entity Matching\nMethod: " + entity_matching.getMethodName() +"\nTotal Time: ";
	        	details_manager.print_Sentence(msg, (overheadEnd - overheadStart)/1000);
	        }
	
	        // Run Entity Clustering
	        if(final_run) 
				eventPublisher.publish("Entity Clustering", event_name);
	        
	        overheadStart = System.currentTimeMillis();
	        
			if (interrupt(interrupted)) {
				context.close();
				return null;
			}
            EquivalenceCluster[] entityClusters = entity_clustering.getDuplicates(simPairs);
			WorkflowManager.setEntityClusters(entityClusters);
	
	        // Print clustering performance
	        overheadEnd = System.currentTimeMillis();
	        ClustersPerformance clp = new ClustersPerformance(entityClusters, WorkflowManager.ground_truth);
	        clp.setStatistics();        
	        if (final_run)
	        	details_manager.print_ClustersPerformance(clp, 
	        			(overheadEnd - overheadStart)/1000, 
	        			entity_clustering.getMethodName(), 
	        			entity_clustering.getMethodConfiguration());
	
	        eventPublisher.publish("", event_name);
	        
	        context.close();
	        return new Pair<>(clp, performances);
		}
		catch (InterruptedException e) {
			Thread.currentThread().interrupt();
            WorkflowManager.setErrorMessage(e.getMessage());
            context.close();
			return null;
		}
        catch(Exception e) {
        	e.printStackTrace();
            WorkflowManager.setErrorMessage(e.getMessage());
            context.close();
			return null;
		}
        
	}



	/**
     * Run a step by step workflow, using random or grid search based on the given parameter.
     *
     * @param random      If true, will use random search. Otherwise, grid.
     * @return ClustersPerformance of the workflow result
     */
	public static Pair<ClustersPerformance, List<Triplet<String, BlocksPerformance, Double>>> 
    runStepByStepWorkflow(boolean random, Map<String, Object> methodsConfig, AtomicBoolean interrupted) {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(WorkflowManager.class);
	
		try {
			
			double bestA = 0, time1, time2, originalComparisons;
		    int bestIteration = 0, iterationsNum;
		    BlocksPerformance blp;
		    List<Triplet<String, BlocksPerformance, Double>> performances = new ArrayList<>();
		    
			String event_name="execution_step";
			eventPublisher = context.getBean(EventPublisher.class);
			details_manager = new WorkflowDetailsManager();
			
			// Print profile entities statistics
			if(WorkflowManager.er_mode.equals(JedaiOptions.DIRTY_ER))
				details_manager.print_Sentence("Input Entity Profiles", WorkflowManager.profilesD1.size());
			else {
				details_manager.print_Sentence("Input Entity Profiles 1", WorkflowManager.profilesD1.size());
				details_manager.print_Sentence("Input Entity Profiles 2", WorkflowManager.profilesD2.size());
			}
			details_manager.print_Sentence("Existing Duplicates", WorkflowManager.ground_truth.getDuplicates().size());
			 
			if (interrupt(interrupted)) {
				context.close();
				return null;
			}
			// Schema Clustering local optimization
		    AttributeClusters[] scClusters = null;
		    if (schema_clustering != null) {
	    		eventPublisher.publish("Schema Clustering", event_name);
		
		        // Run Schema Clustering 
		        if (WorkflowManager.er_mode.equals(JedaiOptions.DIRTY_ER)) {
		            scClusters = schema_clustering.getClusters(WorkflowManager.profilesD1);
		        } else {
		            scClusters = schema_clustering.getClusters(WorkflowManager.profilesD1, WorkflowManager.profilesD2);
		        }
		    }
		    
            if (interrupt(interrupted)) {
				context.close();
				return null;
			}
		    final List<AbstractBlock> blocks = new ArrayList<>();
		    if (block_building != null && !block_building.isEmpty()) {	
		    	
                List<MethodModel> bb_methods = (List<MethodModel>) methodsConfig.get(JedaiOptions.BLOCK_BUILDING);
                
		    	int index = 0;
		    	for (IBlockBuilding bb : block_building) {
		    		
		    		//the process was stopped by the user
					if (interrupt(interrupted)) {
                        context.close();
                        return null;
                    }		
		    		
		    		time1 = System.currentTimeMillis();
		            if (bb_methods.get(index).getConfiguration_type().equals(JedaiOptions.AUTOMATIC_CONFIG)) {
		            	
		            	// Block Building local optimization
		        	    eventPublisher.publish("Block Building Optimizations", event_name);
		        	    
		        	    //the process was stopped by the user
		    			if (interrupt(interrupted)) {
                            context.close();
                            return null;
                        }		
		        	    
		                if (WorkflowManager.er_mode.equals(JedaiOptions.DIRTY_ER)) {
		                    originalComparisons = WorkflowManager.profilesD1.size() * WorkflowManager.profilesD1.size();
		                } else {
		                    originalComparisons = ((double) WorkflowManager.profilesD1.size()) * WorkflowManager.profilesD2.size();
		                }
		
		                iterationsNum = random ? WorkflowManager.NO_OF_TRIALS : bb.getNumberOfGridConfigurations();
		
		                for (int j = 0; j < iterationsNum; j++) {
		                	
		                	//the process was stopped by the user
		        			if (interrupt(interrupted)) {
                                context.close();
                                return null;
                            }		
		        			
		                    // Set next configuration
		                    if (random) {
		                        bb.setNextRandomConfiguration();
		                    } else {
		                        bb.setNumberedGridConfiguration(j);
		                    }
		
		                    // Process the blocks
		                    final List<AbstractBlock> originalBlocks = new ArrayList<>(blocks);
		                    originalBlocks.addAll(BlockUtils.runBlockBuilding(WorkflowManager.er_mode, scClusters, WorkflowManager.profilesD1, WorkflowManager.profilesD2, bb));
		
		                    if (originalBlocks.isEmpty()) {
		                        continue;
		                    }
		
		                    final BlocksPerformance methodBlp = new BlocksPerformance(originalBlocks, WorkflowManager.ground_truth);
		                    methodBlp.setStatistics();
		                    double recall = methodBlp.getPc();
		                    double rr = 1 - methodBlp.getAggregateCardinality() / originalComparisons;
		                    double a = rr * recall;
		                    if (bestA < a) {
		                        bestIteration = j;
		                        bestA = a;
		                    }
		                }
		                details_manager.print_Sentence("\nBest iteration", bestIteration);
		                details_manager.print_Sentence("Best performance", bestA);
		
		                // Set final block building parameters
		                if (random) {
		                    bb.setNumberedRandomConfiguration(bestIteration);
		                } else {
		                    bb.setNumberedGridConfiguration(bestIteration);
		                }
		            }
		            
		            
		            // Process the blocks with block building
		            eventPublisher.publish("Block Building", event_name);
		            
		            if (WorkflowManager.er_mode.equals(JedaiOptions.DIRTY_ER)) {
		                blocks.addAll(bb.getBlocks(WorkflowManager.profilesD1));
		            } else {
		                blocks.addAll(bb.getBlocks(WorkflowManager.profilesD1, WorkflowManager.profilesD2));
		            }
		
		            time2 = System.currentTimeMillis();
		            	
		            blp = new BlocksPerformance(blocks, WorkflowManager.ground_truth);
		            blp.setStatistics();
		            details_manager.print_BlockBuildingPerformance(blp, 
		            		time2 - time1, 
	                		bb.getMethodConfiguration(), 
	                		bb.getMethodName());
		            
		            performances.add(new Triplet<>(bb.getMethodName(), blp, time2 - time1));
		
		            index++;
		        }
		    }
		    
		    if (interrupt(interrupted)) {
				context.close();
				return null;
			}
		    // Block Cleaning methods local optimization	
		    List<AbstractBlock> cleanedBlocks = blocks;
		    if (block_cleaning != null && !block_cleaning.isEmpty()) {

		    	List<MethodModel> bp_methods = (List<MethodModel>) methodsConfig.get(JedaiOptions.BLOCK_CLEANING);
		    	int index = 0;
		        for (IBlockProcessing bp: block_cleaning) {	
		        	
		        	//the process was stopped by the user
					if (interrupt(interrupted)) {
                        context.close();
                        return null;
                    }		
		           
		        	// Start time measurement
		            time1 = System.currentTimeMillis();
		
		            // Check if we should configure this method automatically
		            if (bp_methods.get(index).getConfiguration_type().equals(JedaiOptions.AUTOMATIC_CONFIG)) {
		                // Optimize the method
		            	eventPublisher.publish("Block Cleaning Optimizations", event_name);
		            	//the process was stopped by the user
		    				
		                BlockUtils.optimizeBlockProcessing(bp, blocks, random);
		                
		                if (interrupt(interrupted)) {
                            context.close();
                            return null;
                        }	
		            }
		
		            // Process blocks with this method
		            eventPublisher.publish("Block Cleaning", event_name);
		            cleanedBlocks = bp.refineBlocks(blocks);
		
		            // Measure milliseconds it took to optimize & run method
		            time2 = System.currentTimeMillis();
		
		            blp = new BlocksPerformance(cleanedBlocks, WorkflowManager.ground_truth);
		            blp.setStatistics();
		            details_manager.print_BlockBuildingPerformance(blp, 
		            		time2 - time1, 
	                		bp.getMethodConfiguration(), 
	                		bp.getMethodName());
		            
		            performances.add(new Triplet<>(bp.getMethodName(), blp, time2 - time1));
		            
		            // Increment index
		            index++;
		        }
		    }
		    
		    if (interrupt(interrupted)) {
				context.close();
				return null;
			}	

		    // Comparison Cleaning local optimization
		    time1 = System.currentTimeMillis();
		    List<AbstractBlock> finalBlocks;
		    MethodModel cc_method = (MethodModel) methodsConfig.get(JedaiOptions.COMPARISON_CLEANING);
		    if (cc_method.getConfiguration_type().equals(JedaiOptions.AUTOMATIC_CONFIG)) {
		    	eventPublisher.publish("Comparison Cleaning Optimizations", event_name);
		        BlockUtils.optimizeBlockProcessing(comparison_cleaning, cleanedBlocks, random);
		    }	
		    
		    if (interrupt(interrupted)) {
				context.close();
				return null;
			}	
		    
		    eventPublisher.publish("Comparison Cleaning", event_name);
		    finalBlocks = comparison_cleaning.refineBlocks(cleanedBlocks);
		    time2 = System.currentTimeMillis();
		    
		    if (interrupt(interrupted)) {
				context.close();
				return null;
			}	
	
		    blp = new BlocksPerformance(finalBlocks, WorkflowManager.ground_truth);
		    blp.setStatistics();
		    details_manager.print_BlockBuildingPerformance(blp, 
	        		time2 - time1, 
	        		comparison_cleaning.getMethodConfiguration(), 
	        		comparison_cleaning.getMethodName());
		    performances.add(new Triplet<>(comparison_cleaning.getMethodName(), blp, time2 - time1));
		
		    
		    
		    // Entity Matching & Clustering local optimization
		    time1 = System.currentTimeMillis();
		    MethodModel em_method = (MethodModel) methodsConfig.get(JedaiOptions.ENTITY_MATCHING);
		    MethodModel ec_method = (MethodModel) methodsConfig.get(JedaiOptions.ENTITY_CLUSTERING);
		    boolean matchingAutomatic = em_method.getConfiguration_type().equals(JedaiOptions.AUTOMATIC_CONFIG);
		    boolean clusteringAutomatic = ec_method.getConfiguration_type().equals(JedaiOptions.AUTOMATIC_CONFIG);
		    
		    if (matchingAutomatic || clusteringAutomatic) {
		        // Show message that we are doing optimization based on the selected options
		        String optimizationMsg = (matchingAutomatic ? "Matching" : "") +
		                (matchingAutomatic && clusteringAutomatic ? " & " : "") +
		                (clusteringAutomatic ? "Clustering" : "");
		        eventPublisher.publish("Entity " + optimizationMsg + " Optimizations", event_name);
		
		        double bestFMeasure = 0;
		
		        // Check if we are using random search or grid search
		        if (random) {
		            bestIteration = 0;
		
		            // Optimize entity matching and clustering with random search
		            for (int j = 0; j < WorkflowManager.NO_OF_TRIALS; j++) {
		                // Set entity matching parameters automatically if needed
		                if (matchingAutomatic) 
		                    entity_matching.setNextRandomConfiguration();
		                
		                final SimilarityPairs sims = entity_matching.executeComparisons(finalBlocks);
		
		                // Set entity clustering parameters automatically if needed
		                if (clusteringAutomatic) 
		                    entity_clustering.setNextRandomConfiguration();
		                
		                final EquivalenceCluster[] clusters = entity_clustering.getDuplicates(sims);
		
		                final ClustersPerformance clp = new ClustersPerformance(clusters, WorkflowManager.ground_truth);
		                clp.setStatistics();
		                double fMeasure = clp.getFMeasure();
		                if (bestFMeasure < fMeasure) {
		                    bestIteration = j;
		                    bestFMeasure = fMeasure;
		                }
		                
		                if (interrupt(interrupted)) {
                            context.close();
                            return null;
                        }	
		            }
		            details_manager.print_Sentence("\nBest Iteration", bestIteration);
		            details_manager.print_Sentence("Best FMeasure", bestFMeasure);
		
		            time1 = System.currentTimeMillis();
		
		            if (interrupt(interrupted)) {
                        context.close();
                        return null;
                    }	
		            // Set the best iteration's parameters to the methods that should be automatically configured
		            if (matchingAutomatic) 
		            	entity_matching.setNumberedRandomConfiguration(bestIteration);
		            
                    if (interrupt(interrupted)) {
                        context.close();
                        return null;
                    }	
		            
		            if (clusteringAutomatic) 
		            	entity_clustering.setNumberedRandomConfiguration(bestIteration);
		            
		        } else {
		
		            int bestInnerIteration = 0;
		            int bestOuterIteration = 0;
		
		            // Get number of loops for each
		            int outerLoops = (matchingAutomatic) ? entity_matching.getNumberOfGridConfigurations() : 1;
		            int innerLoops = (clusteringAutomatic) ? entity_clustering.getNumberOfGridConfigurations() : 1;
		
		            // Iterate all entity matching configurations
		            for (int j = 0; j < outerLoops; j++) {
		                if (matchingAutomatic) {
		                    entity_matching.setNumberedGridConfiguration(j);
		                }
		                final SimilarityPairs sims = entity_matching.executeComparisons(finalBlocks);
		
		                // Iterate all entity clustering configurations
		                for (int k = 0; k < innerLoops; k++) {
		                    if (clusteringAutomatic) {
		                        entity_clustering.setNumberedGridConfiguration(k);
		                    }
		                    final EquivalenceCluster[] clusters = entity_clustering.getDuplicates(sims);
		
		                    final ClustersPerformance clp = new ClustersPerformance(clusters, WorkflowManager.ground_truth);
		                    clp.setStatistics();
		                    double fMeasure = clp.getFMeasure();
		                    if (bestFMeasure < fMeasure) {
		                        bestInnerIteration = k;
		                        bestOuterIteration = j;
		                        bestFMeasure = fMeasure;
		                    }
		                }
		                if (interrupt(interrupted)) {
                            context.close();
                            return null;
                        }	
		            }
		            eventPublisher.publish("\nBest Inner Iteration", String.valueOf(bestInnerIteration));
		            eventPublisher.publish("Best Outer Iteration", String.valueOf(bestOuterIteration));
		            eventPublisher.publish("Best FMeasure", String.valueOf(bestFMeasure));
		            
		            if (interrupt(interrupted)) {
                        context.close();
                        return null;
                    }	
		
		            // Set the best iteration's parameters to the methods that should be automatically configured
		            if (matchingAutomatic) 
		                entity_matching.setNumberedGridConfiguration(bestOuterIteration);
		            
                    if (interrupt(interrupted)) {
                        context.close();
                        return null;
                    }	
		            
		            if (clusteringAutomatic) 
		            	entity_clustering.setNumberedGridConfiguration(bestInnerIteration);
		        }
		    }
		    
		    if (interrupt(interrupted)) {
				context.close();
				return null;
			}	
		    
		    // Run entity matching with final configuration
		    eventPublisher.publish("Entity Matching", event_name);
		    final SimilarityPairs sims = entity_matching.executeComparisons(finalBlocks);
		
		    if (interrupt(interrupted)) {
				context.close();
				return null;
			}	
		    
		    // Run entity clustering with final configuration
		    eventPublisher.publish("Entity Clustering", event_name);
		    
		    if (interrupt(interrupted)) {
				context.close();
				return null;
			}	
		    
		EquivalenceCluster[] entityClusters = entity_clustering.getDuplicates(sims);
			WorkflowManager.setEntityClusters(entityClusters);
	
		    time2 = System.currentTimeMillis();
	
		
		    final ClustersPerformance clp = new ClustersPerformance(entityClusters, WorkflowManager.ground_truth);
		    clp.setStatistics();
		    // TODO: Could set the entire configuration details instead of entity clustering method name & config.	
		    details_manager.print_ClustersPerformance(clp, 
		    		time2 - time1,
	    			entity_clustering.getMethodName(), 
	    			entity_clustering.getMethodConfiguration());
		    
            eventPublisher.publish("", event_name);
			context.close();
            
		    return new Pair<>(clp, performances);
		}
		catch(Exception e) {
			e.printStackTrace();
			WorkflowManager.setErrorMessage(e.getMessage());
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
    
}