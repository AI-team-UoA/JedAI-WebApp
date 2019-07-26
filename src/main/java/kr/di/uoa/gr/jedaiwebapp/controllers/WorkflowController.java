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
import org.scify.jedai.utilities.enumerations.BlockBuildingMethod;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import kr.di.uoa.gr.jedaiwebapp.models.DataReadModel;
import kr.di.uoa.gr.jedaiwebapp.models.MethodModel;
import kr.di.uoa.gr.jedaiwebapp.utilities.DynamicMethodConfiguration;
import kr.di.uoa.gr.jedaiwebapp.utilities.JedaiOptions;
import kr.di.uoa.gr.jedaiwebapp.utilities.MethodConfigurations;
import kr.di.uoa.gr.jedaiwebapp.utilities.WorkflowManager;


@RestController
@RequestMapping("/workflow/**")
public class WorkflowController {
	
	
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
     * Handle POST request and set the appropriate entity profile
     *
     * @entity_id the id of the input entity - if id == 3 then it is the ground-truth file
     * @filetype the type of the input -it can also be a database
     * @source the path or the db url
     * @configurations configurations of how to read the input file
     * @return whether it was set successfully 
     */	
	@PostMapping("/workflow/set_configurations/dataread")	
	public boolean DataRead(
			@RequestParam String entity_id,
			@RequestParam String filetype,
			@RequestParam String source,
			@RequestParam MultiValueMap<String, Object> configurations) {
		try {
				
			switch (entity_id) {
			case "1":
				WorkflowManager.profilesD1 = new DataReadModel(filetype, source, configurations).read();
				break;
			case "2":
				WorkflowManager.profilesD1 = new DataReadModel(filetype, source, configurations).read();
				break;
			case "3":
				WorkflowManager.ground_truth = new DataReadModel(filetype, source, configurations);
				break;
			default:
				break;
			}
			
			
			return true;
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
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

	

}
