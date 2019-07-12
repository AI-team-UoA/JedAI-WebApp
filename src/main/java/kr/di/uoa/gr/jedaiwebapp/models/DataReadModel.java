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

public class DataReadModel {
	private String filetype;
	private String filepath;
	private String url;
	private MultiValueMap<String, String> configurations;
	
	
	public DataReadModel(String filetype, String filepath_url, MultiValueMap<String, String> configurations) {
		this.filetype = filetype;
		if (filetype == "Database") {
			this.url = filepath_url;
			this.filepath = null;
		}
		else {
			this.filepath = filepath_url;
			this.url = null;
		}
		this.configurations = configurations;
	}
	
	
	public List<EntityProfile> read() {
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
	            System.out.println(profiles.size());
	        }
	        return profiles;
	}

	
	public IEntityReader CSVReader() {
			
        EntityCSVReader csvReader = new EntityCSVReader(filepath);
        boolean first_row = Boolean.parseBoolean(configurations.getFirst("first_row"));
        char seperator = this.configurations.getFirst("seperator").charAt(0);
        int id_index = Integer.parseInt(configurations.getFirst("id_index"));
        
        csvReader.setAttributeNamesInFirstRow(first_row);
        csvReader.setSeparator(seperator);
        csvReader.setIdIndex(id_index);
        //csvReader.setAttributesToExclude(Ints.toArray(indicesToExcludeSet));
        
        return csvReader;
	}
	
	public IEntityReader DBReader() {
		
        EntityDBReader dbReader = new EntityDBReader(this.url);
        String table =  this.configurations.getFirst("table");
        String username =  this.configurations.getFirst("username");
        String password =  this.configurations.getFirst("password");
        boolean ssl =  Boolean.parseBoolean(this.configurations.getFirst("ssl"));
       
        		
        dbReader.setTable(table);
        dbReader.setUser(username);
        dbReader.setPassword(password);
        dbReader.setSSL(ssl);
        //dbReader.setAttributesToExclude(excludedAttrs.toArray(new String[0]));
        
        return dbReader;        
	}
	
	
	public IEntityReader RDFReader() {
		
		EntityRDFReader rdfReader = new EntityRDFReader(filepath);
	    //rdfReader.setAttributesToExclude(excludedPredicates.toArray(new String[0]));
		return rdfReader;
	}
		
	public IEntityReader XMLReader() {
			
		EntityXMLreader xmlReader = new EntityXMLreader(filepath);
		//rdfReader.setAttributesToExclude(excludedPredicates.toArray(new String[0]));
		return xmlReader;
	}
	
	public IEntityReader SerializationReader() {
		
		EntitySerializationReader objReader = new EntitySerializationReader(filepath);
	    //rdfReader.setAttributesToExclude(excludedPredicates.toArray(new String[0]));
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


	public MultiValueMap<String, String> getConfigurations() {
		return configurations;
	}


	public void setConfigurations(MultiValueMap<String, String> configurations) {
		this.configurations = configurations;
	}
}
