package kr.di.uoa.gr.jedaiwebapp.models.requests.DataRead;

public abstract class ProfileReaderModel {
	private int entity_id;
	private String filetype;
	private CSVConfigurations configuration; //Change me
	
	
	public ProfileReaderModel(String strId, String type) {
		setFiletype(type);
		setEntity_id(Integer.parseInt(strId));		
	}



	public int getEntity_id() {
		return entity_id;
	}



	public void setEntity_id(int entity_id) {
		this.entity_id = entity_id;
	}



	public String getFiletype() {
		return filetype;
	}



	public void setFiletype(String filetype) {
		this.filetype = filetype;
	}



	public CSVConfigurations getConfiguration() {
		return configuration;
	}



	public void setConfiguration(CSVConfigurations configuration) {
		this.configuration = configuration;
	}
	

}
