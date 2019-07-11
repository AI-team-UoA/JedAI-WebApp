package kr.di.uoa.gr.jedaiwebapp.models.requests.DataRead;

import java.util.ArrayList;
import java.util.List;

public class CSVConfigurations extends Configurations {
	private String filepath;
	private boolean first_row;
	private String seperator;
	private int id_index;
	private List<String> excluded_attr;
	
	
	public CSVConfigurations(String path, boolean first_row_attr, String sep, int index) {
		filepath = path;
		first_row = first_row_attr;
		seperator = sep;
		id_index = index;
		excluded_attr = new ArrayList<String>();
	}
	
	
	
	
	
	public String getFilepath() {
		return filepath;
	}

	public void setFile_path(String file_path) {
		this.filepath = file_path;
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

	public List<String> getExcluded_attr() {
		return excluded_attr;
	}

	public void setExcluded_attr(List<String> excluded_items) {
		this.excluded_attr = excluded_items;
	}

}
