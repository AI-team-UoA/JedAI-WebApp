package kr.di.uoa.gr.jedaiwebapp.controllers;


import java.util.List;

import org.scify.jedai.blockprocessing.IBlockProcessing;
import org.scify.jedai.datamodel.EntityProfile;
import org.scify.jedai.schemaclustering.ISchemaClustering;
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
	private MethodModel entity_matching;
	private MethodModel entity_clustering;
	private List<MethodModel> block_building;
	private List<MethodModel> block_cleaning;
	
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
	}
	
	

	
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
	
	
	
	
	
	@PostMapping("/set_configurations/schemaclustering")	
	public boolean setSchemaClustering(@RequestBody MethodModel schema_clustering) {
		if(!schema_clustering.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 			
			this.schema_clustering = MethodConfigurations.getSchemaClusteringMethodByName(schema_clustering.getLabel());
		else
			this.schema_clustering = DynamicMethodConfiguration.configureSchemaClusteringMethod(
					schema_clustering.getLabel(),
					schema_clustering.getParameters());
                    
		
		System.out.println("SC: " + this.schema_clustering);
		return this.schema_clustering != null;
	}
	
	
	
	
	
	@PostMapping("/set_configurations/comparisoncleaning")	
	public boolean setComparisonCleaning(@RequestBody MethodModel comparison_cleaning) {
		
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
	
	@PostMapping("/set_configurations/entitymatching")	
	public boolean setEntityMatching(@RequestBody MethodModel entity_matching) {
		this.setEntity_matching(entity_matching);
		
		return this.entity_matching != null;
	}
	
	@PostMapping("/set_configurations/entityclustering")	
	public boolean setEntityClustering(@RequestBody MethodModel entity_clustering) {
		this.setEntity_clustering(entity_clustering);
		
		return this.entity_clustering != null;
	}
	
	@PostMapping("/set_configurations/blockbuilding")	
	public boolean setBlockBuilding(@RequestBody List<MethodModel> block_building) {
		this.setBlock_building(block_building);
		
		return this.block_building != null;
	}
	
	@PostMapping("/set_configurations/blockcleaning")	
	public boolean setBlockCleaning(@RequestBody List<MethodModel> block_cleaning) {
		this.setBlock_cleaning(block_cleaning);
		
		return this.block_cleaning != null;
	}
	
	
	
	public boolean isSet(){return 
			this.profilesD1 != null && this.profilesD2 != null &&
			this.ground_truth != null && this.schema_clustering!= null && 
			this.comparison_cleaning != null && this.entity_matching != null && 
			this.entity_clustering != null && this.block_building != null && 
			this.block_cleaning != null ;
	}
	
	public List<EntityProfile> getProfilesD1() {
		return profilesD1;
	}

	public void setProfilesD1(List<EntityProfile> entity_1) {
		this.profilesD1 = entity_1;
	}

	public List<EntityProfile> getProfilesD2() {
		return profilesD2;
	}

	public void setProfilesD2(List<EntityProfile> entity_2) {
		this.profilesD2 = entity_2;
	}

	public DataReadModel getGround_truth() {
		return ground_truth;
	}

	public void setGround_trut(DataReadModel ground_truth) {
		this.ground_truth = ground_truth;
	}

	public MethodModel getEntity_matching() {
		return entity_matching;
	}


	public void setEntity_matching(MethodModel entity_matching) {
		this.entity_matching = entity_matching;
	}


	public MethodModel getEntity_clustering() {
		return entity_clustering;
	}


	public void setEntity_clustering(MethodModel entity_clustering) {
		this.entity_clustering = entity_clustering;
	}


	public List<MethodModel> getBlock_building() {
		return block_building;
	}


	public void setBlock_building(List<MethodModel> block_building) {
		this.block_building = block_building;
	}
	
	public List<MethodModel> getBlock_cleaning() {
		return block_cleaning;
	}


	public void setBlock_cleaning(List<MethodModel> block_cleaning) {
		this.block_cleaning = block_cleaning;
	}

	public String getEr_mode() {
		return er_mode;
	}

	public void setEr_mode(String er_mode) {
		this.er_mode = er_mode;
	}
	
	
	
			
		
	
}
