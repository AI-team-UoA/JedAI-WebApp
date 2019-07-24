package kr.di.uoa.gr.jedaiwebapp.controllers;

import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import kr.di.uoa.gr.jedaiwebapp.models.DataReadModel;

@RestController
@RequestMapping("/set_configurations/**")
public class ConfigurationsController {
	
	private DataReadModel entity_1;
	private DataReadModel entity_2;
	private DataReadModel ground_trut;
	
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
	
	
	
			
		
	
}
