package kr.di.uoa.gr.jedaiwebapp.utilities;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

import org.javatuples.Pair;
import org.javatuples.Triplet;
import org.scify.jedai.blockbuilding.IBlockBuilding;
import org.scify.jedai.blockprocessing.IBlockProcessing;
import org.scify.jedai.datamodel.EntityProfile;
import org.scify.jedai.datamodel.EquivalenceCluster;
import org.scify.jedai.entityclustering.IEntityClustering;
import org.scify.jedai.entitymatching.IEntityMatching;
import org.scify.jedai.prioritization.IPrioritization;
import org.scify.jedai.schemaclustering.ISchemaClustering;
import org.scify.jedai.utilities.BlocksPerformance;
import org.scify.jedai.utilities.ClustersPerformance;
import org.scify.jedai.utilities.datastructures.AbstractDuplicatePropagation;
import org.scify.jedai.utilities.enumerations.BlockBuildingMethod;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;

import gnu.trove.list.TIntList;
import kr.di.uoa.gr.jedaiwebapp.utilities.events.EventPublisher;
import kr.di.uoa.gr.jedaiwebapp.utilities.workflows.BlockingWF;
import kr.di.uoa.gr.jedaiwebapp.utilities.workflows.JoinWF;
import kr.di.uoa.gr.jedaiwebapp.datatypes.EntityProfileNode;
import kr.di.uoa.gr.jedaiwebapp.datatypes.MethodModel;
import kr.di.uoa.gr.jedaiwebapp.datatypes.SimilarityMethodModel;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.DynamicMethodConfiguration;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.JedaiOptions;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.MethodConfigurations;

public class WorkflowManager {
	
	public final static int NO_OF_TRIALS = 100;

	public static  String er_mode = null;
	public static  String wf_mode = null;

	public static List<EntityProfile> profilesD1 = null;
	public static List<EntityProfile> profilesD2 = null;
	public static AbstractDuplicatePropagation ground_truth = null;

	public static IPrioritization prioritization = null;
	public static MethodModel prioritizationModel = null; 
	public static List<IBlockProcessing> block_cleaning = null;
	
	private static EquivalenceCluster[] entityClusters = null;

	
	private static EventPublisher eventPublisher;
	public static int workflowConfigurationsID = -1;
	

	@Bean
	EventPublisher publisherBean () {
        return new EventPublisher();
    }
	
	@Bean
	SSE_Manager SSE_ManagerBean () {
		return new SSE_Manager();
	}
	
	public static void clean() {
		
		workflowConfigurationsID = -1;
		entityClusters = null;
		switch(wf_mode){
			case JedaiOptions.WORKFLOW_BLOCKING_BASED:
				BlockingWF.clean();
				break;
			case JedaiOptions.WORKFLOW_JOIN_BASED:
				JoinWF.clean();
				break;
		}
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
	
	public static void setSchemaClustering(MethodModel sc) {
		if (!sc.getLabel().equals(JedaiOptions.NO_SCHEMA_CLUSTERING)) {
			
			ISchemaClustering schemaClustering;
			if(!sc.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 			
				schemaClustering = MethodConfigurations.getSchemaClusteringMethodByName(sc.getLabel());
			else
				schemaClustering = DynamicMethodConfiguration.configureSchemaClusteringMethod(
					sc.getLabel(),
					sc.getParameters());
	                    
			switch(wf_mode){
				case JedaiOptions.WORKFLOW_BLOCKING_BASED:
					BlockingWF.setSchema_clustering(schemaClustering);
			}
		}	
	}

	public static void setPrioritizationMethod(MethodModel pm){
        
	}


	public static void setComparisonCleaning(MethodModel cc) {
		
		if (!cc.getLabel().equals(JedaiOptions.NO_CLEANING)) {

			IBlockProcessing comparisonCleaning = null;

			if(!cc.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 	
				comparisonCleaning = MethodConfigurations.getMethodByName(cc.getLabel());
			else 
				comparisonCleaning = DynamicMethodConfiguration.configureComparisonCleaningMethod(
        			cc.getLabel(),
					cc.getParameters() 
				);
					
			switch(wf_mode){
				case JedaiOptions.WORKFLOW_BLOCKING_BASED:
					BlockingWF.setComparison_cleaning(comparisonCleaning);
			}
		}
	}
	
	public static void setEntityMatching(MethodModel em) {
		IEntityMatching entityMatching = null;

		if(!em.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 	
			entityMatching = DynamicMethodConfiguration
                    .configureEntityMatchingMethod(em.getLabel(), null);
         else 
		 	entityMatching = DynamicMethodConfiguration
                    .configureEntityMatchingMethod(em.getLabel(), em.getParameters());
        
		switch(wf_mode){
			case JedaiOptions.WORKFLOW_BLOCKING_BASED:
				BlockingWF.setEntity_matching(entityMatching);
		}
	}
	
	public static void setEntityClustering(MethodModel ec) {
		IEntityClustering entityClustering = null;

		if(!ec.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 
			entityClustering = MethodConfigurations.getEntityClusteringMethod(ec.getLabel());
         else 
		 	entityClustering = DynamicMethodConfiguration.configureEntityClusteringMethod(ec.getLabel(), ec.getParameters());
		
		switch(wf_mode){
			case JedaiOptions.WORKFLOW_BLOCKING_BASED:
				BlockingWF.setEntity_clustering(entityClustering);
			case JedaiOptions.WORKFLOW_JOIN_BASED:
				JoinWF.setEntityClustering(entityClustering);
		}
	}

	public static void setSimilarityJoinMethod(SimilarityMethodModel similarity_join) {
		JoinWF.setSimilarityJoinMethod(similarity_join);
	}
	

	public static void addBlockBuildingMethod(MethodModel method) {
		
    	BlockBuildingMethod blockBuilding_method = MethodConfigurations.blockBuildingMethods.get(method.getLabel());
       
        IBlockBuilding blockBuildingMethod;
        if (!method.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 
            
            blockBuildingMethod = BlockBuildingMethod.getDefaultConfiguration(blockBuilding_method);
         else 
        	 blockBuildingMethod = DynamicMethodConfiguration.configureBlockBuildingMethod(blockBuilding_method, method.getParameters());
		
		switch(wf_mode){
			case JedaiOptions.WORKFLOW_BLOCKING_BASED:
				BlockingWF.addBlockBuilding(blockBuildingMethod);
		}
	}
	
	public static void addBlockCleaningMethod(MethodModel method) {
		
		IBlockProcessing blockCleaningMethod;
        if (!method.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 
			blockCleaningMethod = MethodConfigurations.getMethodByName(method.getLabel());
          else 
		  	blockCleaningMethod = DynamicMethodConfiguration.configureBlockCleaningMethod(
             		method.getLabel(), method.getParameters());

		switch(wf_mode){
			case JedaiOptions.WORKFLOW_BLOCKING_BASED:
				BlockingWF.addBlockCleaning(blockCleaningMethod);
		}
	}    
    
    
	
	
	public static Pair<ClustersPerformance, List<Triplet<String, BlocksPerformance, Double>>>
	runWorkflow(boolean final_run, AtomicBoolean interrupted){
		switch(wf_mode){
			case JedaiOptions.WORKFLOW_BLOCKING_BASED:
				return BlockingWF.run(final_run, interrupted);
			case JedaiOptions.WORKFLOW_JOIN_BASED:
				return JoinWF.run(final_run, interrupted);
			default:
				return null;
		}
	}

	
	
	
	
/*
	
	public static Pair<ClustersPerformance, List<Triplet<String, BlocksPerformance, Double>>>
	runProgressiveWF(boolean final_run, AtomicBoolean interrupted){

	}
*/		
	/**
     * Run a step by step workflow, using random or grid search based on the given parameter.
     *
     * @param random      If true, will use random search. Otherwise, grid.
     * @return ClustersPerformance of the workflow result
     */
	public static Pair<ClustersPerformance, List<Triplet<String, BlocksPerformance, Double>>> 
	runStepByStepWorkflow(Map<String, Object> methodsConfig, boolean random, AtomicBoolean interrupted) {
		switch(wf_mode){
			case JedaiOptions.WORKFLOW_BLOCKING_BASED:
				return BlockingWF.runStepByStepWorkflow(random, methodsConfig, interrupted);
			default:
				return null;
		}
	}
	
	
	
	/**
     * send the error message to the front-end
     *
     */
	public static void setErrorMessage(String error_msg) {
		AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(WorkflowManager.class);
		if (eventPublisher == null) {
			eventPublisher = context.getBean(EventPublisher.class);
		}
		eventPublisher.publish(error_msg, "exception");
		context.close();
	}
    
    
    
    
	/**
     * Construct a list containing the detected duplicates
     * 
     * @return the list of the detected duplicates
     */
	public static List<List<EntityProfileNode>> getDetectedDuplicates(){
		
		List<List<EntityProfileNode>> duplicates = new ArrayList<>();
		
		for (EquivalenceCluster ec : ground_truth.getDetectedEquivalenceClusters()) {
			if (er_mode.equals(JedaiOptions.DIRTY_ER)) {
				
				if (!ec.getEntityIdsD1().isEmpty()) { 
					TIntList duplicate_list = ec.getEntityIdsD1();
					if(duplicate_list.size() > 1 ) {
						List<EntityProfileNode> entity_duplicates = new ArrayList<>();
						for (int i = 0; i < duplicate_list.size(); i++){
							int id = duplicate_list.get(i);
							entity_duplicates.add(new EntityProfileNode(WorkflowManager.profilesD1.get(id), id));
						}

						duplicates.add(entity_duplicates);		
					}
				}
				
			}
			else {
				if (!ec.getEntityIdsD1().isEmpty() && !ec.getEntityIdsD2().isEmpty()) {
					TIntList ids_1 = ec.getEntityIdsD1();
					TIntList ids_2 = ec.getEntityIdsD2();
					List<EntityProfileNode> entity_duplicates = new ArrayList<>();
					for (int i = 0; i < ids_1.size(); i++){
						int id = ids_1.get(i);
						entity_duplicates.add(new EntityProfileNode(WorkflowManager.profilesD1.get(id), id));
					}
					for (int i = 0; i < ids_2.size(); i++){
						int id = ids_2.get(i);
						entity_duplicates.add(new EntityProfileNode(WorkflowManager.profilesD2.get(id), id));
					}
					
					if (entity_duplicates.size() > 1 ) duplicates.add(entity_duplicates);					
				}
			}
		}
		return duplicates;
	}
    
	

	/**
     * When bestIteration is null, set the next random configuration for each method in the workflow that should be
     * automatically configured. If it is set, set these methods to that configuration.
     *
     * @param bestIteration Best iteration (optional)
     */
    public static void iterateHolisticRandom(Map<String, Object> methodsConfig, Integer bestIteration) {
		switch(wf_mode){
			case JedaiOptions.WORKFLOW_BLOCKING_BASED:
				//Check if schema clustering parameters should be set automatically
				if(BlockingWF.schema_clustering != null)
				if (bestIteration == null) 
					BlockingWF.schema_clustering.setNextRandomConfiguration();
				else 
					BlockingWF.schema_clustering.setNumberedRandomConfiguration(bestIteration);
			
		
				// Check if any block building method parameters should be set automatically
				if (BlockingWF.getBlock_building() != null && !BlockingWF.getBlock_building().isEmpty()) {
					// Index of the methods in the Block Building List
					int enabledMethodIndex = 0;
		
					// Check each block building method configuration
					List<MethodModel> blockBuilding_methods = (List<MethodModel>) methodsConfig.get(JedaiOptions.BLOCK_BUILDING);
					for (MethodModel method : blockBuilding_methods){
						// Method is enabled, check if we should configure automatically
						if (method.getConfiguration_type().equals(JedaiOptions.AUTOMATIC_CONFIG)) {
							// Get instance of the method and set next random configuration
							if (bestIteration == null) 
								BlockingWF.block_building.get(enabledMethodIndex).setNextRandomConfiguration();
							else 
								BlockingWF.block_building.get(enabledMethodIndex).setNumberedRandomConfiguration(bestIteration);
							
							// Increment index
							enabledMethodIndex++;
						}
					}            
				}
		
				
				// Check if any block cleaning method parameters should be set automatically
				if (BlockingWF.getBlock_cleaning() != null && !BlockingWF.getBlock_cleaning().isEmpty()) {
					// Index of the methods in the Block Cleaning Methods List
					int enabledMethodIndex = 0;
		
					// Check each block cleaning method configuration
					List<MethodModel> blockCleaning_methods = (List<MethodModel>) methodsConfig.get(JedaiOptions.BLOCK_CLEANING);
					for ( MethodModel method :blockCleaning_methods) {
						
						// Method is enabled, check if we should configure automatically
						if (method.getConfiguration_type().equals(JedaiOptions.AUTOMATIC_CONFIG)) {
							// Get instance of the method and set next random configuration
							if (bestIteration == null) 
								BlockingWF.block_cleaning.get(enabledMethodIndex).setNextRandomConfiguration();
							else
								BlockingWF.block_cleaning.get(enabledMethodIndex).setNumberedRandomConfiguration(bestIteration);
							
							// Increment index
							enabledMethodIndex++;
						}
					}
				}
			
		
				// Check if comparison cleaning parameters should be set automatically
				if(BlockingWF.comparison_cleaning != null)
					if (((MethodModel) methodsConfig.get(JedaiOptions.COMPARISON_CLEANING)).getConfiguration_type().equals(JedaiOptions.AUTOMATIC_CONFIG)) 
						if (bestIteration == null) 
							BlockingWF.comparison_cleaning.setNextRandomConfiguration();
						else 
							BlockingWF.comparison_cleaning.setNumberedRandomConfiguration(bestIteration);
					
		
				// Check if entity matching parameters should be set automatically
				if (((MethodModel) methodsConfig.get(JedaiOptions.ENTITY_MATCHING)).getConfiguration_type().equals(JedaiOptions.AUTOMATIC_CONFIG)) {
					if (bestIteration == null) 
						BlockingWF.entity_matching.setNextRandomConfiguration();
					else 
						BlockingWF.entity_matching.setNumberedRandomConfiguration(bestIteration);
				}
		
				
				// Check if entity clustering parameters should be set automatically
				if (((MethodModel) methodsConfig.get(JedaiOptions.ENTITY_CLUSTERING)).getConfiguration_type().equals(JedaiOptions.AUTOMATIC_CONFIG)) {
					if (bestIteration == null) 
						BlockingWF.entity_clustering.setNextRandomConfiguration();
					else 
						BlockingWF.entity_clustering.setNumberedRandomConfiguration(bestIteration);
				}
		}
    	
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

	public static EquivalenceCluster[] getEntityClusters() {
		return entityClusters;
	}

	public static void setEntityClusters(EquivalenceCluster[] entityClusters) {
		WorkflowManager.entityClusters = entityClusters;
	}
	
	
	
	
}
