package kr.di.uoa.gr.jedaiwebapp.controllers;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.scify.jedai.blockbuilding.IBlockBuilding;
import org.scify.jedai.blockprocessing.IBlockProcessing;
import org.scify.jedai.datamodel.EntityProfile;
import org.scify.jedai.entityclustering.IEntityClustering;
import org.scify.jedai.entitymatching.IEntityMatching;
import org.scify.jedai.schemaclustering.ISchemaClustering;
import org.scify.jedai.utilities.ClustersPerformance;
import org.scify.jedai.utilities.enumerations.BlockBuildingMethod;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.di.uoa.gr.jedaiwebapp.models.DataReadModel;
import kr.di.uoa.gr.jedaiwebapp.models.MethodModel;
import kr.di.uoa.gr.jedaiwebapp.utilities.DynamicMethodConfiguration;
import kr.di.uoa.gr.jedaiwebapp.utilities.JedaiOptions;
import kr.di.uoa.gr.jedaiwebapp.utilities.MethodConfigurations;
import kr.di.uoa.gr.jedaiwebapp.utilities.WorkflowManager;


@RestController
@RequestMapping("/workflow/**")
public class WorkflowController {
	
	private final static int NO_OF_TRIALS = 100;
	private Map<String, Object> methodsConfig;
	
	WorkflowController(){
		
		this.methodsConfig = new HashMap<String, Object>();
	}
	
	
	
	/**
     * Handle GET request and set the Entity Resolution mode
     *
     * @er_mode the selected er mode
     * @return whether it was set successfully 
     */	
	@GetMapping("/workflow/set_configurations/ermode/{er_mode}")	
	public boolean getERMode(@PathVariable(value = "er_mode") String er_mode) {
		if (er_mode != null) {
			if (er_mode.equals("dirty"))
				WorkflowManager.er_mode = JedaiOptions.DIRTY_ER;
			else
				WorkflowManager.er_mode = JedaiOptions.CLEAN_CLEAN_ER;
		}
		return WorkflowManager.er_mode != null;		
	}
	
	
	
	/**
     * Handle POST request and set the schema clustering method
     *
     * @schema_clustering the method and its configurations that the user has selected
     * @return whether it was set successfully 
     */	
	@PostMapping("/workflow/set_configurations/schemaclustering")	
	public boolean setSchemaClustering(@RequestBody MethodModel schema_clustering) {
		try {
			methodsConfig.put(JedaiOptions.SCHEMA_CLUSTERING, schema_clustering);
			
			if (schema_clustering.getLabel().equals(JedaiOptions.NO_SCHEMA_CLUSTERING)) return true;
			
			if(!schema_clustering.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 			
				WorkflowManager.schema_clustering = MethodConfigurations.getSchemaClusteringMethodByName(schema_clustering.getLabel());
			else
				WorkflowManager.schema_clustering = DynamicMethodConfiguration.configureSchemaClusteringMethod(
						schema_clustering.getLabel(),
						schema_clustering.getParameters());
	                    
			
			System.out.println("SC: " + WorkflowManager.schema_clustering);
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
		return WorkflowManager.schema_clustering != null;
	}
	
	
	
	
	/**
     * Handle POST request and set the comparison cleaning method
     *
     * @comparison_cleaning the method and its configurations that the user has selected
     * @return whether it was set successfully 
     */	
	@PostMapping("/workflow/set_configurations/comparisoncleaning")	
	public boolean setComparisonCleaning(@RequestBody MethodModel comparison_cleaning) {
		
		try {
			methodsConfig.put(JedaiOptions.COMPARISON_CLEANING, comparison_cleaning);
			
			//TODO WARNING
			if (comparison_cleaning.getLabel().equals(JedaiOptions.NO_CLEANING)) return true;
			
			if (comparison_cleaning != null) {
				if(!comparison_cleaning.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 	
	                
					WorkflowManager.comparison_cleaning = MethodConfigurations.getMethodByName(comparison_cleaning.getLabel());
	             else 
	                
	            	 WorkflowManager.comparison_cleaning = DynamicMethodConfiguration.configureComparisonCleaningMethod(
	            			comparison_cleaning.getLabel(),
	            			comparison_cleaning.getParameters() );
	        }
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
			
		System.out.println("CC: " + WorkflowManager.comparison_cleaning);
		return WorkflowManager.comparison_cleaning != null;
	}
	
	
	/**
     * Handle POST request and set the entity mathcing method
     *
     * @entity_matching the method and its configurations that the user has selected
     * @return whether it was set successfully 
     */	
	@PostMapping("/workflow/set_configurations/entitymatching")	
	public boolean setEntityMatching(@RequestBody MethodModel entity_matching) {
		
		try {
			methodsConfig.put(JedaiOptions.ENTITY_MATHCING, entity_matching);
			
			if(!entity_matching.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 	
				WorkflowManager.entity_matching = DynamicMethodConfiguration
	                    .configureEntityMatchingMethod(entity_matching.getLabel(), null);
	         else 
	        	 WorkflowManager.entity_matching = DynamicMethodConfiguration
	                    .configureEntityMatchingMethod(entity_matching.getLabel(), entity_matching.getParameters());
	        
			System.out.println("EM: " + WorkflowManager.entity_matching);
			
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
		
		return WorkflowManager.entity_matching != null;
	}
	
	
	
	
	
	/**
     * Handle POST request and set the entity clustering method
     *
     * @entity_clustering the method and its configurations that the user has selected
     * @return whether it was set successfully 
     */	
	@PostMapping("/workflow/set_configurations/entityclustering")	
	public boolean setEntityClustering(@RequestBody MethodModel entity_clustering) {
		
		try {
			methodsConfig.put(JedaiOptions.ENTITY_CLUSTERING, entity_clustering);
			
			if(!entity_clustering.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 
				WorkflowManager.entity_clustering = MethodConfigurations.getEntityClusteringMethod(entity_clustering.getLabel());
	         else 
	        	 WorkflowManager.entity_clustering = DynamicMethodConfiguration.configureEntityClusteringMethod(entity_clustering.getLabel(), entity_clustering.getParameters());
	        
			System.out.println("EC: " + WorkflowManager.entity_clustering);
			
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
		
		return WorkflowManager.entity_clustering != null;
	}
	
	
	
	/**
     * Handle POST request and set the Block Building methods
     *
     * @block_building a list of methods and their configurations, selected by the user
     * @return whether it was set successfully 
     */	
	@PostMapping("/set_configurations/blockbuilding")	
	public boolean setBlockBuilding(@RequestBody List<MethodModel> block_building) {
		
		try {
			methodsConfig.put(JedaiOptions.BLOCK_BUILDING, block_building);
			
			WorkflowManager.block_building = new ArrayList<>();
	        for (MethodModel method : block_building) {
	
	        	BlockBuildingMethod blockBuilding_method = MethodConfigurations.blockBuildingMethods.get(method.getLabel());
	           
	            IBlockBuilding blockBuildingMethod;
	            if (!method.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 
	                
	                blockBuildingMethod = BlockBuildingMethod.getDefaultConfiguration(blockBuilding_method);
	             else 
	            	 blockBuildingMethod = DynamicMethodConfiguration.configureBlockBuildingMethod(blockBuilding_method, method.getParameters());
	            
	
	            WorkflowManager.block_building.add(blockBuildingMethod);
	        }
	        
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
		        
		return WorkflowManager.block_building != null;
	}
	
	
	/**
     * Handle POST request and set the Block Cleaning methods
     *
     * @block_cleaning a list of methods and their configurations, selected by the user
     * @return whether it was set successfully 
     */	
	@PostMapping("/set_configurations/blockcleaning")	
	public boolean setBlockCleaning(@RequestBody List<MethodModel> block_cleaning) {
		
		try {
			methodsConfig.put(JedaiOptions.BLOCK_CLEANING, block_cleaning);
			
			if(block_cleaning.size() == 0) return true;
			
			WorkflowManager.block_cleaning = new ArrayList<>();
	        for (MethodModel method : block_cleaning) {
	          
	            IBlockProcessing blockCleaning_method;
	            if (!method.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 
	            	blockCleaning_method = MethodConfigurations.getMethodByName(method.getLabel());
	             else 
	            	 blockCleaning_method = DynamicMethodConfiguration.configureBlockCleaningMethod(
	                		method.getLabel(), method.getParameters());
	            
	
	            WorkflowManager.block_cleaning.add(blockCleaning_method);
	        }
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
				
		return WorkflowManager.block_cleaning != null;
	}

	
	
	
	/**
     * The method is triggered when the used presses the "Execute Workflow" button.
     * Firstly set the parameters if the configuration type of any method is automatic. 
     * Then execute the Work Flow.
     *
     * @automatic_type Holistic or Step-by-step
     * @search_type 
     * @return  
     */		
	@GetMapping("/workflow/execution/automatic_type/{automatic_type}/search_type/{search_type}")	
	public ClustersPerformance executeWorkflow(
			@PathVariable(value = "automatic_type") String automatic_type,
			@PathVariable(value = "search_type") String search_type) {
		try {
			if(this.anyAutomaticConfig()) {
				
				if(automatic_type.equals(JedaiOptions.AUTOCONFIG_HOLISTIC)) {				
					// Holistic random configuration (holistic grid is not supported at this time)
	                int bestIteration = 0;
	                double bestFMeasure = 0;
	
	                for (int j = 0; j < NO_OF_TRIALS; j++) {
	                    int finalJ = j;
	                    
	                    // Set the next automatic random configuration
	                    iterateHolisticRandom( null);
	
	                    // Run a workflow and check its F-measure
	                    
	                    ClustersPerformance clp = WorkflowManager.runWorkflow(false);
	
	                    // If there was a problem with this random workflow, skip this iteration
	                    if (clp == null) {
	                        continue;
	                    }
	
	                    // Keep this iteration if it has the best F-measure so far
	                    double fMeasure = clp.getFMeasure();
	                    if (bestFMeasure < fMeasure) {
	                        bestIteration = j;
	                        bestFMeasure = fMeasure;
	                    }
	                    
		                System.out.println("Best Iteration\t:\t" + bestIteration);
		                System.out.println("Best FMeasure\t:\t" + bestFMeasure);
		
		                // Before running the workflow, we should configure the methods using the best iteration's parameters
		                iterateHolisticRandom(bestIteration);
		
		                // Run the final workflow (whether there was an automatic configuration or not)
		                return WorkflowManager.runWorkflow(true);
	                }
				}
				else {
					 // Step-by-step automatic configuration. Set random or grid depending on the selected search type.
	                return WorkflowManager.runStepByStepWorkflow(search_type.equals(JedaiOptions.AUTOCONFIG_RANDOMSEARCH));
				}
				
			}
			 // Run workflow without any automatic configuration
	        return WorkflowManager.runWorkflow(true);
		}
		catch(Exception e) {
			e.printStackTrace();
			return null;
		}
		
	}
	
	
	
	
	public boolean anyAutomaticConfig() {
		
		boolean automatic_conf = false;
		
		 for (String key : methodsConfig.keySet())  {
			 Object value = methodsConfig.get(key);
			 if (value instanceof MethodModel ) {
				 String conf = ((MethodModel) value).getConfiguration_type();
				 automatic_conf = automatic_conf || conf.equals(JedaiOptions.AUTOMATIC_CONFIG);
						 
			 }
			 else if (value instanceof List ) {
				 for (MethodModel method : (List<MethodModel>) value) {
					 String conf = method.getConfiguration_type();
					 automatic_conf = automatic_conf || conf.equals(JedaiOptions.AUTOMATIC_CONFIG);					 
				 }
			 }
		 }
		
		 System.out.println("Auto Config: " + automatic_conf);
		 return automatic_conf;	
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	/**
     * When bestIteration is null, set the next random configuration for each method in the workflow that should be
     * automatically configured. If it is set, set these methods to that configuration.
     *
     * @param bestIteration Best iteration (optional)
     */
    private void iterateHolisticRandom(Integer bestIteration) {
        
    	//Check if schema clustering parameters should be set automatically
    	if(WorkflowManager.schema_clustering != null)
	        if (bestIteration == null) 
	        	WorkflowManager.schema_clustering.setNextRandomConfiguration();
	        else 
	        	WorkflowManager.schema_clustering.setNumberedRandomConfiguration(bestIteration);
        

        // Check if any block building method parameters should be set automatically
        if (WorkflowManager.getBlock_building() != null && !WorkflowManager.getBlock_building().isEmpty()) {
            // Index of the methods in the Block Building List
            int enabledMethodIndex = 0;

            // Check each block building method configuration
            List<MethodModel> blockBuilding_methods = (List<MethodModel>) methodsConfig.get(JedaiOptions.BLOCK_BUILDING);
            for (MethodModel method : blockBuilding_methods){
                // Method is enabled, check if we should configure automatically
                if (method.getConfiguration_type().equals(JedaiOptions.AUTOMATIC_CONFIG)) {
                    // Get instance of the method and set next random configuration
                    if (bestIteration == null) 
                    	WorkflowManager.block_building.get(enabledMethodIndex).setNextRandomConfiguration();
                    else 
                    	WorkflowManager.block_building.get(enabledMethodIndex).setNumberedRandomConfiguration(bestIteration);
                    
                    // Increment index
                    enabledMethodIndex++;
                }
            }            
        }

        
        // Check if any block cleaning method parameters should be set automatically
        if (WorkflowManager.getBlock_cleaning() != null && !WorkflowManager.getBlock_cleaning().isEmpty()) {
            // Index of the methods in the Block Cleaning Methods List
            int enabledMethodIndex = 0;

            // Check each block cleaning method configuration
            List<MethodModel> blockCleaning_methods = (List<MethodModel>) methodsConfig.get(JedaiOptions.BLOCK_CLEANING);
            for ( MethodModel method :blockCleaning_methods) {
                
                // Method is enabled, check if we should configure automatically
                if (method.getConfiguration_type().equals(JedaiOptions.AUTOMATIC_CONFIG)) {
                    // Get instance of the method and set next random configuration
                    if (bestIteration == null) 
                    	WorkflowManager.block_cleaning.get(enabledMethodIndex).setNextRandomConfiguration();
                    else
                    	WorkflowManager.block_cleaning.get(enabledMethodIndex).setNumberedRandomConfiguration(bestIteration);
                    
                    // Increment index
                    enabledMethodIndex++;
                }
            }
        }
       

        // Check if comparison cleaning parameters should be set automatically
        if(WorkflowManager.comparison_cleaning != null)
	        if (((MethodModel) methodsConfig.get(JedaiOptions.COMPARISON_CLEANING)).getConfiguration_type().equals(JedaiOptions.AUTOMATIC_CONFIG)) 
	            if (bestIteration == null) 
	            	WorkflowManager.comparison_cleaning.setNextRandomConfiguration();
	            else 
	            	WorkflowManager.comparison_cleaning.setNumberedRandomConfiguration(bestIteration);
            
	        
        
        
        // Check if entity matching parameters should be set automatically
        if (((MethodModel) methodsConfig.get(JedaiOptions.ENTITY_MATHCING)).equals(JedaiOptions.AUTOMATIC_CONFIG)) {
            if (bestIteration == null) 
            	WorkflowManager.entity_matching.setNextRandomConfiguration();
            else 
            	WorkflowManager.entity_matching.setNumberedRandomConfiguration(bestIteration);
        }

        
        // Check if entity clustering parameters should be set automatically
        if (((MethodModel) methodsConfig.get(JedaiOptions.ENTITY_CLUSTERING)).equals(JedaiOptions.AUTOMATIC_CONFIG)) {
            if (bestIteration == null) 
            	WorkflowManager.entity_clustering.setNextRandomConfiguration();
            else 
            	WorkflowManager.entity_clustering.setNumberedRandomConfiguration(bestIteration);
        }
    }

}
