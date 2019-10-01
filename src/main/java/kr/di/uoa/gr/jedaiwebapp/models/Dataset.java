package kr.di.uoa.gr.jedaiwebapp.models;

import java.util.Map;

import javax.persistence.*;



@Entity
public class Dataset {
	
	@Id
	@GeneratedValue
	private int id;
	private String type;
	
	@ElementCollection
	private Map<String, String> configurations;
	
	public Dataset() {
		super();
	}
	
	public Dataset(int id, String type, Map<String, String> configurations) {
		this.id = id;
		this.type = type;
		this.configurations = configurations;
	}
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Map<String, String> getConfigurations() {
		return configurations;
	}

	public void setConfigurations(Map<String, String> configurations) {
		this.configurations = configurations;
	}
	
	

}
