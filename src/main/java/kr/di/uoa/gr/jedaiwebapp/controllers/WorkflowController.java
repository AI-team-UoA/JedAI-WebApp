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


@RestController
@RequestMapping("/set_configurations/**")
public class ConfigurationsController {
	
	private String er_mode;
	private List<EntityProfile> profilesD1;
	private List<EntityProfile> profilesD2;
	private DataReadModel ground_truth;

	private ISchemaClustering schema_clustering;
	private IBlockProcessing comparison_cleaning;
	private IEntityMatching entity_matching;
	private IEntityClustering entity_clustering;
	private List<IBlockBuilding> block_building;
	private List<IBlockProcessing> block_cleaning;
	
	private Map<String, Object> methodsConfig;
	
	ConfigurationsController(){
		this.er_mode = null;
		this.profilesD1 = null;
		this.profilesD2 = null;
		this.ground_truth = null;
		this.schema_clustering = null;
		this.comparison_cleaning = null;
		this.entity_matching = null;
		this.entity_clustering = null;
		this.block_building = null;
		this.block_cleaning = null;
		
		this.methodsConfig = new HashMap<String, Object>();
	}
	
	
	
	/**
     * Handle GET request and set the Entity Resolution mode
     *
     * @er_mode the selected er mode
     * @return whether it was set successfully 
     */	
	@GetMapping("/set_configurations/ermode/{er_mode}")	
	public boolean getERMode(@PathVariable(value = "er_mode") String er_mode) {
		if (er_mode != null) {
			if (er_mode.equals("dirty"))
				this.setEr_mode(JedaiOptions.DIRTY_ER);
			else
				this.setEr_mode(JedaiOptions.CLEAN_CLEAN_ER);
		}
		return er_mode != null;		
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
	@PostMapping("/set_configurations/dataread")	
	public boolean DataRead(
			@RequestParam String entity_id,
			@RequestParam String filetype,
			@RequestParam String source,
			@RequestParam MultiValueMap<String, Object> configurations) {
		try {
				
			switch (entity_id) {
			case "1":
				this.profilesD1 = new DataReadModel(filetype, source, configurations).read();
				break;
			case "2":
				this.profilesD1 = new DataReadModel(filetype, source, configurations).read();
				break;
			case "3":
				this.ground_truth = new DataReadModel(filetype, source, configurations);
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
	@PostMapping("/set_configurations/schemaclustering")	
	public boolean setSchemaClustering(@RequestBody MethodModel schema_clustering) {
		
		methodsConfig.put(JedaiOptions.SCHEMA_CLUSTERING, schema_clustering);
		
		if(!schema_clustering.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 			
			this.schema_clustering = MethodConfigurations.getSchemaClusteringMethodByName(schema_clustering.getLabel());
		else
			this.schema_clustering = DynamicMethodConfiguration.configureSchemaClusteringMethod(
					schema_clustering.getLabel(),
					schema_clustering.getParameters());
                    
		
		System.out.println("SC: " + this.schema_clustering);
		return this.schema_clustering != null;
	}
	
	
	
	
	/**
     * Handle POST request and set the comparison cleaning method
     *
     * @comparison_cleaning the method and its configurations that the user has selected
     * @return whether it was set successfully 
     */	
	@PostMapping("/set_configurations/comparisoncleaning")	
	public boolean setComparisonCleaning(@RequestBody MethodModel comparison_cleaning) {
		
		methodsConfig.put(JedaiOptions.COMPARISON_CLEANING, comparison_cleaning);
		
		if (comparison_cleaning != null && !comparison_cleaning.getMethod_name().equals(JedaiOptions.NO_CLEANING)) {
			if(!comparison_cleaning.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 	
                
                this.comparison_cleaning = MethodConfigurations.getMethodByName(comparison_cleaning.getLabel());
             else 
                
            	this.comparison_cleaning = DynamicMethodConfiguration.configureComparisonCleaningMethod(
            			comparison_cleaning.getLabel(),
            			comparison_cleaning.getParameters() );
        }
		
		System.out.println("CC: " + this.comparison_cleaning);
		return this.comparison_cleaning != null;
	}
	
	
	/**
     * Handle POST request and set the entity mathcing method
     *
     * @entity_matching the method and its configurations that the user has selected
     * @return whether it was set successfully 
     */	
	@PostMapping("/set_configurations/entitymatching")	
	public boolean setEntityMatching(@RequestBody MethodModel entity_matching) {
		
		methodsConfig.put(JedaiOptions.ENTITY_MATHCING, entity_matching);
		
		if(!entity_matching.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 	
            this.entity_matching = DynamicMethodConfiguration
                    .configureEntityMatchingMethod(entity_matching.getLabel(), null);
         else 
            this.entity_matching = DynamicMethodConfiguration
                    .configureEntityMatchingMethod(entity_matching.getLabel(), entity_matching.getParameters());
        
		
		System.out.println("EM: " + this.entity_matching);
		return this.entity_matching != null;
	}
	
	
	
	/**
     * Handle POST request and set the entity clustering method
     *
     * @entity_clustering the method and its configurations that the user has selected
     * @return whether it was set successfully 
     */	
	@PostMapping("/set_configurations/entityclustering")	
	public boolean setEntityClustering(@RequestBody MethodModel entity_clustering) {
		
		methodsConfig.put(JedaiOptions.ENTITY_CLUSTERING, entity_clustering);
		
		if(!entity_clustering.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 
			this.entity_clustering = MethodConfigurations.getEntityClusteringMethod(entity_clustering.getLabel());
         else 
        	this.entity_clustering = DynamicMethodConfiguration.configureEntityClusteringMethod(entity_clustering.getLabel(), entity_clustering.getParameters());
        
		System.out.println("EC: " + this.entity_clustering);
		return this.entity_clustering != null;
	}
	
	
	
	/**
     * Handle POST request and set the Block Building methods
     *
     * @block_building a list of methods and their configurations, selected by the user
     * @return whether it was set successfully 
     */	
	@PostMapping("/set_configurations/blockbuilding")	
	public boolean setBlockBuilding(@RequestBody List<MethodModel> block_building) {
		
		methodsConfig.put(JedaiOptions.BLOCK_BUILDING, block_building);
		
		this.block_building = new ArrayList<>();
        for (MethodModel method : block_building) {

        	BlockBuildingMethod blockBuilding_method = MethodConfigurations.blockBuildingMethods.get(method.getLabel());
           
            IBlockBuilding blockBuildingMethod;
            if (!method.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 
                
                blockBuildingMethod = BlockBuildingMethod.getDefaultConfiguration(blockBuilding_method);
             else 
            	 blockBuildingMethod = DynamicMethodConfiguration.configureBlockBuildingMethod(blockBuilding_method, method.getParameters());
            

            this.block_building.add(blockBuildingMethod);
        }
        
		return this.block_building != null;
	}
	
	
	/**
     * Handle POST request and set the Block Cleaning methods
     *
     * @block_cleaning a list of methods and their configurations, selected by the user
     * @return whether it was set successfully 
     */	
	@PostMapping("/set_configurations/blockcleaning")	
	public boolean setBlockCleaning(@RequestBody List<MethodModel> block_cleaning) {
		
		methodsConfig.put(JedaiOptions.BLOCK_CLEANING, block_cleaning);
		
		this.block_cleaning = new ArrayList<>();
        for (MethodModel method : block_cleaning) {
          
            IBlockProcessing blockCleaning_method;
            if (!method.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 
                
            	blockCleaning_method = MethodConfigurations.getMethodByName(method.getLabel());
             else 
            
            	 blockCleaning_method = DynamicMethodConfiguration.configureBlockCleaningMethod(
                		method.getLabel(), method.getParameters());
            

            this.block_cleaning.add(blockCleaning_method);
        }
		
		return this.block_cleaning != null;
	}


	// Setters and Getters
	
	public String getEr_mode() {
		return er_mode;
	}



	public void setEr_mode(String er_mode) {
		this.er_mode = er_mode;
	}



	public List<EntityProfile> getProfilesD1() {
		return profilesD1;
	}



	public void setProfilesD1(List<EntityProfile> profilesD1) {
		this.profilesD1 = profilesD1;
	}



	public List<EntityProfile> getProfilesD2() {
		return profilesD2;
	}



	public void setProfilesD2(List<EntityProfile> profilesD2) {
		this.profilesD2 = profilesD2;
	}



	public DataReadModel getGround_truth() {
		return ground_truth;
	}



	public void setGround_truth(DataReadModel ground_truth) {
		this.ground_truth = ground_truth;
	}



	public ISchemaClustering getSchema_clustering() {
		return schema_clustering;
	}



	public void setSchema_clustering(ISchemaClustering schema_clustering) {
		this.schema_clustering = schema_clustering;
	}



	public IBlockProcessing getComparison_cleaning() {
		return comparison_cleaning;
	}



	public void setComparison_cleaning(IBlockProcessing comparison_cleaning) {
		this.comparison_cleaning = comparison_cleaning;
	}



	public IEntityMatching getEntity_matching() {
		return entity_matching;
	}



	public void setEntity_matching(IEntityMatching entity_matching) {
		this.entity_matching = entity_matching;
	}



	public IEntityClustering getEntity_clustering() {
		return entity_clustering;
	}



	public Map<String, Object> getMethodsConfig() {
		return methodsConfig;
	}



	public void setMethodsConfig(Map<String, Object> methodsConfig) {
		this.methodsConfig = methodsConfig;
	}



	public void setEntity_clustering(IEntityClustering entity_clustering) {
		this.entity_clustering = entity_clustering;
	}



	public List<IBlockBuilding> getBlock_building() {
		return block_building;
	}



	public void setBlock_building(List<IBlockBuilding> block_building) {
		this.block_building = block_building;
	}



	public List<IBlockProcessing> getBlock_cleaning() {
		return block_cleaning;
	}



	public void setBlock_cleaning(List<IBlockProcessing> block_cleaning) {
		this.block_cleaning = block_cleaning;
	}
	
	
	

}
