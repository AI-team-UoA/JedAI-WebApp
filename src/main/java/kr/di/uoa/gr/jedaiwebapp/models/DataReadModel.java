package kr.di.uoa.gr.jedaiwebapp.models;

import java.util.List;

import org.scify.jedai.datamodel.EntityProfile;
import org.scify.jedai.datareader.entityreader.EntityCSVReader;
import org.scify.jedai.datareader.entityreader.EntityDBReader;
import org.scify.jedai.datareader.entityreader.EntityRDFReader;
import org.scify.jedai.datareader.entityreader.EntitySerializationReader;
import org.scify.jedai.datareader.entityreader.EntityXMLreader;
import org.scify.jedai.datareader.entityreader.IEntityReader;
import org.springframework.util.MultiValueMap;

import com.fasterxml.jackson.databind.ObjectMapper;

public class DataReadModel {
	private String filetype;
	private String filepath;
	private String url;
	private MultiValueMap<String, Object> configurations;
	private List<EntityProfile> profiles;
	
	public DataReadModel(String filetype, String source, MultiValueMap<String, Object> configurations) throws Exception{
		this.filetype = filetype;
		if (filetype.equals("Database")) {
			this.url = source;
			this.filepath = null;
		}
		else {
			this.filepath = source;
			this.url = null;
		}
		this.configurations = configurations;
		this.profiles = this.read();
	}
		
	
	public List<EntityProfile> read() throws Exception {
		 IEntityReader eReader = null;
		 List<EntityProfile> profiles = null;
		 
		 switch (this.filetype) {
			 case "CSV":
	             eReader = CSVReader();
	             break;
	         case "Database":
	        	 eReader = DBReader();
	             break;
	         case "RDF":
	        	 eReader = RDFReader();
	             break;
	         case "Serialized":
	        	 eReader = SerializationReader();
	             break;
	         case "XML":
	        	 eReader = XMLReader();
	             break;
		 }
		 
		 if (eReader != null) {
			 profiles = eReader.getEntityProfiles();
	        }
	        return profiles;
	}
	
	
	// TODO: validate that start and last indexes don't exceed the size of list
	public List<EntityProfile> readSubset(int start, int last){
		
		return this.profiles.subList(start, last);
	}
	
	public int getProfilesSize() { return this.profiles.size();}

	
	public IEntityReader CSVReader() throws Exception{
			
        EntityCSVReader csvReader = new EntityCSVReader(filepath);
        boolean first_row = Boolean.parseBoolean(((String) configurations.getFirst("first_row")).replace("\"", ""));
        char seperator = ((String)this.configurations.getFirst("seperator")).charAt(1);
        int id_index = Integer.parseInt(((String) configurations.getFirst("id_index")).replace("\"", ""));
        
        ObjectMapper mapper = new ObjectMapper();
        int[] excluded= mapper.readValue((String) configurations.getFirst("excluded_attr"), int[].class);
        
        csvReader.setAttributeNamesInFirstRow(first_row);
        csvReader.setSeparator(seperator);
        csvReader.setIdIndex(id_index);
        
        csvReader.setAttributesToExclude(excluded);
        
        return csvReader;
	}
	
	
	public IEntityReader DBReader() throws Exception{
		
        EntityDBReader dbReader = new EntityDBReader(this.url);
        String table =  ((String)this.configurations.getFirst("table")).replace("\"", "");
        String username = ((String)  this.configurations.getFirst("username")).replace("\"", "");
        String password =  ((String) this.configurations.getFirst("password")).replace("\"", "");  
        boolean ssl =  Boolean.parseBoolean(((String) this.configurations.getFirst("ssl")).replace("\"", ""));
        
        ObjectMapper mapper = new ObjectMapper();
        int[] excluded = mapper.readValue((String) configurations.getFirst("excluded_attr"), int[].class);
        String[] excluded_str = new String[excluded.length];
        for(int i =0; i<excluded_str.length; i++) excluded_str[i] = String.valueOf(excluded[i]);
        
        dbReader.setTable(table);
        dbReader.setUser(username);
        dbReader.setPassword(password);
        dbReader.setSSL(ssl);
        dbReader.setAttributesToExclude(excluded_str);
        
        return dbReader;        
	}
	
	
	public IEntityReader RDFReader() throws Exception {
		
		EntityRDFReader rdfReader = new EntityRDFReader(filepath);
		ObjectMapper mapper = new ObjectMapper();
        int[] excluded= mapper.readValue((String) configurations.getFirst("excluded_attr"), int[].class);
        String[] excluded_str = new String[excluded.length];
        for(int i =0; i<excluded_str.length; i++) excluded_str[i] = String.valueOf(excluded[i]);
        
	    rdfReader.setAttributesToExclude(excluded_str);
		return rdfReader;
	}
		
	public IEntityReader XMLReader() throws Exception{
			
		EntityXMLreader xmlReader = new EntityXMLreader(filepath);
		ObjectMapper mapper = new ObjectMapper();
        int[] excluded= mapper.readValue((String) configurations.getFirst("excluded_attr"), int[].class);
        String[] excluded_str = new String[excluded.length];
        for(int i =0; i<excluded_str.length; i++) excluded_str[i] = String.valueOf(excluded[i]);
        
        xmlReader.setAttributesToExclude(excluded_str);
		return xmlReader;
	}
	
	public IEntityReader SerializationReader() {
		
		EntitySerializationReader objReader = new EntitySerializationReader(filepath);
		return objReader;
	}
	
	


	public String getFiletype() {
		return filetype;
	}


	public void setFiletype(String filetype) {
		this.filetype = filetype;
	}


	public String getFilepath() {
		return filepath;
	}


	public void setFilepath(String filepath) {
		this.filepath = filepath;
	}


	public MultiValueMap<String, Object> getConfigurations() {
		return configurations;
	}


	public void setConfigurations(MultiValueMap<String, Object> configurations) {
		this.configurations = configurations;
	}
}
