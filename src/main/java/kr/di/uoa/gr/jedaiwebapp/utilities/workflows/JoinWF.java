package kr.di.uoa.gr.jedaiwebapp.utilities.workflows;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

import com.github.andrewoma.dexx.collection.Map;

import org.javatuples.Pair;
import org.javatuples.Triplet;
import org.scify.jedai.datamodel.EquivalenceCluster;
import org.scify.jedai.datamodel.SimilarityPairs;
import org.scify.jedai.entityclustering.IEntityClustering;
import org.scify.jedai.similarityjoins.ISimilarityJoin;
import org.scify.jedai.utilities.BlocksPerformance;
import org.scify.jedai.utilities.ClustersPerformance;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;

import kr.di.uoa.gr.jedaiwebapp.datatypes.MethodModel;
import kr.di.uoa.gr.jedaiwebapp.datatypes.SimilarityMethodModel;
import kr.di.uoa.gr.jedaiwebapp.utilities.SSE_Manager;
import kr.di.uoa.gr.jedaiwebapp.utilities.WorkflowDetailsManager;
import kr.di.uoa.gr.jedaiwebapp.utilities.WorkflowManager;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.DynamicMethodConfiguration;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.JedaiOptions;
import kr.di.uoa.gr.jedaiwebapp.utilities.events.EventPublisher;

public class JoinWF {

    public static ISimilarityJoin similarity_join_method = null;
    public static List<String> join_attributes = null;
	public static IEntityClustering entity_clustering = null;
    
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
		similarity_join_method = null;
		join_attributes = null;
		entity_clustering = null;
	}
	
	public static boolean configurationOk(){
		return similarity_join_method != null && join_attributes != null && entity_clustering != null;
	}
	
	
	public static void setSimilarityJoinMethod(SimilarityMethodModel similarity_join) {
		similarity_join_method = DynamicMethodConfiguration.configureSimilarityJoinMethod(similarity_join);
		
		join_attributes = new ArrayList<>();
		join_attributes.add(similarity_join.getAttribute1());
		if (WorkflowManager.er_mode.equals(JedaiOptions.CLEAN_CLEAN_ER))
			join_attributes.add(similarity_join.getAttribute2());
	}

	public static void setEntityClustering(IEntityClustering ec) {
		entity_clustering = ec;
	}
    


    public static Pair<ClustersPerformance, List<Triplet<String, BlocksPerformance, Double>>>
	run(boolean final_run, AtomicBoolean interrupted){
		AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(JoinWF.class);

		try{
			double overheadStart = System.currentTimeMillis();
			List<Triplet<String, BlocksPerformance, Double>> performances = new ArrayList<>();
			
			String event_name="execution_step";
	        eventPublisher = context.getBean(EventPublisher.class);
			details_manager = new WorkflowDetailsManager();

			if(WorkflowManager.er_mode.equals(JedaiOptions.DIRTY_ER))
					details_manager.print_Sentence("Input Entity Profiles", WorkflowManager.profilesD1.size());
			else {
				details_manager.print_Sentence("Input Entity Profiles 1", WorkflowManager.profilesD1.size());
				details_manager.print_Sentence("Input Entity Profiles 2", WorkflowManager.profilesD2.size());
			}
			details_manager.print_Sentence("Existing Duplicates", WorkflowManager.ground_truth.getDuplicates().size());
			
			eventPublisher.publish("Similarity Join", event_name);
			details_manager.print_Sentence("Similarity Join method: " + similarity_join_method.getMethodName());
			details_manager.print_Sentence("Similarity Join Parameters: " + similarity_join_method.getMethodParameters());
			details_manager.print_Sentence("D1 Attribute: " +  join_attributes.get(0));
						
			if (interrupt(interrupted)) {
				context.close();
				return null;
			}

			SimilarityPairs simPairs;
			if (WorkflowManager.er_mode.equals(JedaiOptions.DIRTY_ER)) {
				simPairs = similarity_join_method.executeFiltering(
                    join_attributes.get(0),
                    WorkflowManager.profilesD1
				);
			} else {
				details_manager.print_Sentence("D1 Attribute: " + join_attributes.get(0));
				simPairs = similarity_join_method.executeFiltering(
                        join_attributes.get(0),
						join_attributes.get(1),
						WorkflowManager.profilesD1,
						WorkflowManager.profilesD2
				);
			}

			if (interrupt(interrupted)) {
				context.close();
				return null;
			}
			eventPublisher.publish("Entity Clustering", event_name);

			EquivalenceCluster[] entityClusters = entity_clustering.getDuplicates(simPairs);
			WorkflowManager.setEntityClusters(entityClusters);

			double overheadEnd = System.currentTimeMillis();
			ClustersPerformance clp = new ClustersPerformance(entityClusters, WorkflowManager.ground_truth);
			clp.setStatistics();

			details_manager.print_ClustersPerformance(clp, (overheadEnd - overheadStart)/1000, 
				entity_clustering.getMethodName(), 
				entity_clustering.getMethodConfiguration());
			
			eventPublisher.publish("Entity Clustering", event_name);
			
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
			
			double time1, time2;
		    int bestIteration = 0;
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
			
			SimilarityPairs simPairs;
			if (WorkflowManager.er_mode.equals(JedaiOptions.DIRTY_ER)) {
				simPairs = similarity_join_method.executeFiltering(
                    join_attributes.get(0),
                    WorkflowManager.profilesD1
				);
			} else {
				details_manager.print_Sentence("D1 Attribute: " + join_attributes.get(0));
				simPairs = similarity_join_method.executeFiltering(
                        join_attributes.get(0),
						join_attributes.get(1),
						WorkflowManager.profilesD1,
						WorkflowManager.profilesD2
				);
			}

			if (interrupt(interrupted)) {
				context.close();
				return null;
			}
			
			
			time1 = System.currentTimeMillis();
		    MethodModel ec_method = (MethodModel) methodsConfig.get(JedaiOptions.ENTITY_CLUSTERING);
		    boolean clusteringAutomatic = ec_method.getConfiguration_type().equals(JedaiOptions.AUTOMATIC_CONFIG);
		    
		    if (clusteringAutomatic) {
		        eventPublisher.publish("Entity Clustering Optimization", event_name);
		
		        double bestFMeasure = 0;
		
		        // Check if we are using random search or grid search
		        if (random) {
		            bestIteration = 0;
		
		            // Optimize entity matching and clustering with random search
		            for (int j = 0; j < WorkflowManager.NO_OF_TRIALS; j++) {
		                		
		                // Set entity clustering parameters automatically if needed
		                if (clusteringAutomatic) 
		                    entity_clustering.setNextRandomConfiguration();
		                
		                final EquivalenceCluster[] clusters = entity_clustering.getDuplicates(simPairs);
		
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
		            
                    if (interrupt(interrupted)) {
                        context.close();
                        return null;
                    }	
		            
		            if (clusteringAutomatic) 
		            	entity_clustering.setNumberedRandomConfiguration(bestIteration);
		            
		        } else {
		
		            int bestInnerIteration = 0;
		
		            // Get number of loops for each
		            int innerLoops = (clusteringAutomatic) ? entity_clustering.getNumberOfGridConfigurations() : 1;
		
					// Iterate all entity clustering configurations
					for (int k = 0; k < innerLoops; k++) {
						if (clusteringAutomatic) {
							entity_clustering.setNumberedGridConfiguration(k);
						}
						final EquivalenceCluster[] clusters = entity_clustering.getDuplicates(simPairs);
	
						final ClustersPerformance clp = new ClustersPerformance(clusters, WorkflowManager.ground_truth);
						clp.setStatistics();
						double fMeasure = clp.getFMeasure();
						if (bestFMeasure < fMeasure) {
							bestInnerIteration = k;
							bestFMeasure = fMeasure;
						}

		                if (interrupt(interrupted)) {
                            context.close();
                            return null;
                        }	
		            }
		            eventPublisher.publish("\nBest Iteration", String.valueOf(bestInnerIteration));
		            eventPublisher.publish("Best FMeasure", String.valueOf(bestFMeasure));
		            
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
		    
		    // Run entity clustering with final configuration
		    eventPublisher.publish("Entity Clustering", event_name);
		    
		    if (interrupt(interrupted)) {
				context.close();
				return null;
			}	
		    
			EquivalenceCluster[] entityClusters = entity_clustering.getDuplicates(simPairs);
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

}