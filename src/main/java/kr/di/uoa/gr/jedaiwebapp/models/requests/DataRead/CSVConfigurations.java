package kr.di.uoa.gr.jedaiwebapp.models.requests.DataRead;


import org.springframework.util.MultiValueMap;

public class CSVConfigurations extends Configurations {
	private String filename;
	private boolean first_row;
	private String seperator;
	private int id_index;
	private String excluded_attr;
	
	
	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public boolean isFirst_row() {
		return first_row;
	}

	public void setFirst_row(boolean first_row) {
		this.first_row = first_row;
	}

	public String getSeperator() {
		return seperator;
	}

	public void setSeperator(String seperator) {
		this.seperator = seperator;
	}

	public int getId_index() {
		return id_index;
	}

	public void setId_index(int id_index) {
		this.id_index = id_index;
	}

	public String getExcluded_attr() {
		return excluded_attr;
	}

	public void setExcluded_attr(String excluded_items) {
		this.excluded_attr = excluded_items;
	}


}
