package kr.di.uoa.gr.jedaiwebapp.models;

import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="dataset")
public class Dataset {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(updatable = false, nullable = false, unique = true, name="id")
	private int id;
	
	@Column(name="type")
	private String type;
	
	@Column(name="source")
	private String source;
	
	@Column(name="filetype")
	private String filetype;
	
	@Column(name="entity_id")
	private String entity_id;
	
	@Column(name="separator")
	private char separator;
	
	@Column(name="first_row")
	private int first_row;
	
	
	@Column(name="excluded_attr")
	private int[] excluded_attr;
	
	@Column(name="id_index")
	private int id_index;
	
	@Column(name="table_name")
	private String tableName;
	
	@Column(name="db_username")
	private String dbUsername;
	
	@Column(name="db_password")
	private String dbPassword;
	
	@Column(name="ssl")
	private boolean ssl;
	
	
	public Dataset() {}
	
	public Dataset(Map<String, Object> datasetConf) {
		
		if (datasetConf.containsKey("type"))
			this.type = (String) datasetConf.get("type");
		else this.type = null;
		
		if (datasetConf.containsKey("source"))
			this.source = (String) datasetConf.get("source");
		else this.source = null;

		if (datasetConf.containsKey("filetype"))
			this.filetype = (String) datasetConf.get("filetype");
		else this.filetype = null;
		
		if (datasetConf.containsKey("entity_id"))
			this.entity_id = (String) datasetConf.get("entity_id");
		else this.entity_id = null;
		
		if (datasetConf.containsKey("separator"))
			this.separator = (char) datasetConf.get("separator");
		else this.separator = '-';
		
		if (datasetConf.containsKey("first_row"))
			this.first_row = (int) datasetConf.get("first_row");
		else this.first_row = -1;
		
		if (datasetConf.containsKey("excluded_attr"))
			this.excluded_attr = (int[]) datasetConf.get("excluded_attr");
		else this.excluded_attr = null;
		
		if (datasetConf.containsKey("id_index"))
			this.id_index = (int) datasetConf.get("id_index");
		else this.id_index = -1;
		
		if (datasetConf.containsKey("table"))
			this.tableName = (String) datasetConf.get("table");
		else this.tableName = null;
		
		if (datasetConf.containsKey("username"))
			this.dbUsername = (String) datasetConf.get("username");
		else this.dbUsername = null;
		
		if (datasetConf.containsKey("password"))
			this.dbPassword = (String) datasetConf.get("password");
		else this.dbPassword = null;
		
		if (datasetConf.containsKey("ssl"))
			this.ssl = (boolean) datasetConf.get("ssl");
		else this.ssl = false;
			
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

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getFiletype() {
		return filetype;
	}

	public void setFiletype(String filetype) {
		this.filetype = filetype;
	}

	public String getEntity_id() {
		return entity_id;
	}

	public void setEntity_id(String entity_id) {
		this.entity_id = entity_id;
	}

	public char getSeparator() {
		return separator;
	}

	public void setSeparator(char separator) {
		this.separator = separator;
	}

	public int getFirst_row() {
		return first_row;
	}

	public void setFirst_row(int first_row) {
		this.first_row = first_row;
	}

	public int[] getExcluded_attr() {
		return excluded_attr;
	}

	public void setExcluded_attr(int[] excluded_attr) {
		this.excluded_attr = excluded_attr;
	}

	public int getId_index() {
		return id_index;
	}

	public void setId_index(int id_index) {
		this.id_index = id_index;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getDbUsername() {
		return dbUsername;
	}

	public void setDbUsername(String dbUsername) {
		this.dbUsername = dbUsername;
	}

	public String getDbPassword() {
		return dbPassword;
	}

	public void setDbPassword(String dbPassword) {
		this.dbPassword = dbPassword;
	}

	public boolean isSsl() {
		return ssl;
	}

	public void setSsl(boolean ssl) {
		this.ssl = ssl;
	}
	
	
}