package kr.di.uoa.gr.jedaiwebapp.controllers;


import java.util.List;

import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import kr.di.uoa.gr.jedaiwebapp.models.DataReadModel;
import kr.di.uoa.gr.jedaiwebapp.models.MethodModel;
import kr.di.uoa.gr.jedaiwebapp.models.Parameter;

@RestController
@RequestMapping("/set_configurations/**")
public class ConfigurationsController {
	
	private DataReadModel entity_1;
	private DataReadModel entity_2;
	private DataReadModel ground_trut;
	private MethodModel schema_clustering;
	private MethodModel comparison_cleaning;
	private MethodModel entity_matching;
	private MethodModel entity_clustering;
	private List<MethodModel> block_building;
	private List<MethodModel> block_cleaning;
	
	


	@PostMapping("/set_configurations/dataread")	
	public boolean DataRead(
			@RequestParam String entity_id,
			@RequestParam String filetype,
			@RequestParam String source,
			@RequestParam MultiValueMap<String, Object> configurations) {
		try {
				
			switch (entity_id) {
			case "1":
				this.entity_1 = new DataReadModel(filetype, source, configurations);
				break;
			case "2":
				this.entity_2 = new DataReadModel(filetype, source, configurations);
				break;
			case "3":
				this.ground_trut = new DataReadModel(filetype, source, configurations);
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
		this.setSchema_clustering(schema_clustering);
		return this.schema_clustering != null;
	}
	
	@PostMapping("/set_configurations/comparisoncleaning")	
	public boolean setComparisonCleaning(@RequestBody MethodModel comparison_cleaning) {
		this.setComparison_cleaning(comparison_cleaning);
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
	
	
	
	public DataReadModel getEntity_1() {
		return entity_1;
	}

	public void setEntity_1(DataReadModel entity_1) {
		this.entity_1 = entity_1;
	}

	public DataReadModel getEntity_2() {
		return entity_2;
	}

	public void setEntity_2(DataReadModel entity_2) {
		this.entity_2 = entity_2;
	}

	public DataReadModel getGround_trut() {
		return ground_trut;
	}

	public void setGround_trut(DataReadModel ground_trut) {
		this.ground_trut = ground_trut;
	}
	public MethodModel getSchema_clustering() {
		return schema_clustering;
	}
	public void setSchema_clustering(MethodModel schema_clustering) {
		this.schema_clustering = schema_clustering;
	}


	public MethodModel getComparison_cleaning() {
		return comparison_cleaning;
	}


	public void setComparison_cleaning(MethodModel comparison_cleaning) {
		this.comparison_cleaning = comparison_cleaning;
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
	
	
	
			
		
	
}
