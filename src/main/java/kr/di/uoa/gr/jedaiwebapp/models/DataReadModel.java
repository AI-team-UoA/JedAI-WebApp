package kr.di.uoa.gr.jedaiwebapp.models;

import java.util.ArrayList;
import java.util.List;

import org.javatuples.Pair;
import org.scify.jedai.datamodel.EntityProfile;
import org.scify.jedai.datamodel.EquivalenceCluster;
import org.scify.jedai.datareader.entityreader.EntityCSVReader;
import org.scify.jedai.datareader.entityreader.EntityDBReader;
import org.scify.jedai.datareader.entityreader.EntityRDFReader;
import org.scify.jedai.datareader.entityreader.EntitySerializationReader;
import org.scify.jedai.datareader.entityreader.EntityXMLreader;
import org.scify.jedai.datareader.entityreader.IEntityReader;
import org.scify.jedai.datareader.groundtruthreader.GtCSVReader;
import org.scify.jedai.datareader.groundtruthreader.GtRDFReader;
import org.scify.jedai.datareader.groundtruthreader.GtSerializationReader;
import org.scify.jedai.datareader.groundtruthreader.IGroundTruthReader;
import org.scify.jedai.utilities.datastructures.AbstractDuplicatePropagation;
import org.scify.jedai.utilities.datastructures.BilateralDuplicatePropagation;
import org.scify.jedai.utilities.datastructures.UnilateralDuplicatePropagation;
import org.springframework.util.MultiValueMap;

import com.fasterxml.jackson.databind.ObjectMapper;

import gnu.trove.iterator.TIntIterator;
import gnu.trove.list.TIntList;
import kr.di.uoa.gr.jedaiwebapp.utilities.WorkflowManager;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.JedaiOptions;

public class DataReadModel {
	private String filetype;
	private String filepath;
	private String url;
	private MultiValueMap<String, Object> configurations;
	
	
	
	/**
	 * Constructor
	 * 
	 */
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
		
	}
		
	
	/**
	 *Call the appropriate Reader and read the input 
	 *
	 * @return the entities from the input source
	 */
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

	
	/**
	 * Set CSV Reader
	 *
	 * @return the Reader
	 */
	public IEntityReader CSVReader() throws Exception{
			
        EntityCSVReader csvReader = new EntityCSVReader(filepath);
        boolean first_row = Boolean.parseBoolean(((String) configurations.getFirst("first_row")).replace("\"", ""));
        char separator = ((String)this.configurations.getFirst("separator")).charAt(1);
        int id_index = Integer.parseInt(((String) configurations.getFirst("id_index")).replace("\"", ""));
        
        ObjectMapper mapper = new ObjectMapper();
        int[] excluded= mapper.readValue((String) configurations.getFirst("excluded_attr"), int[].class);
        
        csvReader.setAttributeNamesInFirstRow(first_row);
        csvReader.setSeparator(separator);
        csvReader.setIdIndex(id_index);
        
        csvReader.setAttributesToExclude(excluded);
        
        return csvReader;
	}
	
	
	/**
	 * Set RDB Reader
	 *
	 * @return the Reader
	 */
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
	
	
	/**
	 * Set RDF Reader
	 *
	 * @return the Reader
	 */
	public IEntityReader RDFReader() throws Exception {
		
		EntityRDFReader rdfReader = new EntityRDFReader(filepath);
		ObjectMapper mapper = new ObjectMapper();
        int[] excluded= mapper.readValue((String) configurations.getFirst("excluded_attr"), int[].class);
        String[] excluded_str = new String[excluded.length];
        for(int i =0; i<excluded_str.length; i++) excluded_str[i] = String.valueOf(excluded[i]);
        
	    rdfReader.setAttributesToExclude(excluded_str);
		return rdfReader;
	}
	
	
	
	/**
	 * Set XML Reader
	 *
	 * @return the Reader
	 */
	public IEntityReader XMLReader() throws Exception{
			
		EntityXMLreader xmlReader = new EntityXMLreader(filepath);
		ObjectMapper mapper = new ObjectMapper();
        int[] excluded= mapper.readValue((String) configurations.getFirst("excluded_attr"), int[].class);
        String[] excluded_str = new String[excluded.length];
        for(int i =0; i<excluded_str.length; i++) excluded_str[i] = String.valueOf(excluded[i]);
        
        xmlReader.setAttributesToExclude(excluded_str);
		return xmlReader;
	}
	
	/**
	 * Set Serialized object Reader
	 *
	 * @return the Reader
	 */
	public IEntityReader SerializationReader() {
		
		EntitySerializationReader objReader = new EntitySerializationReader(filepath);
		return objReader;
	}
	
	
	
	
	 /**
     * Read ground truth using the specified reader.
     *
     * @param er_type     Clean-Clean or Dirty ER
     * @param profilesD1 Entity Profiles for Dataset 1
     * @param profilesD2 Entity Profiles for Dataset 2
     * @return Ground truth (duplicate propagation)
     */
    public AbstractDuplicatePropagation read_GroundTruth(String er_type, List<EntityProfile> profilesD1, List<EntityProfile> profilesD2) {
        AbstractDuplicatePropagation dp = null;
        IGroundTruthReader gtReader = null;
        

        // If there are no parameters, we cannot initialize the reader
        if (configurations.isEmpty())
            return null;

        switch (filetype) {
            case JedaiOptions.CSV:
                // Get parameters              
                boolean first_row = Boolean.parseBoolean(((String) configurations.getFirst("first_row")).replace("\"", ""));
                char separator = ((String)this.configurations.getFirst("separator")).charAt(1);
               
                // Initialize the reader
                GtCSVReader csvReader = new GtCSVReader(filepath);
                csvReader.setIgnoreFirstRow(first_row);
                csvReader.setSeparator(separator);

                gtReader = csvReader;
                break;
                
            case JedaiOptions.RDF:
                gtReader = new GtRDFReader(filepath);
                break;
                
            case JedaiOptions.SERIALIZED:

                gtReader = new GtSerializationReader(filepath);
                break;
        }

        if (gtReader != null) {
            if (er_type.equals(JedaiOptions.DIRTY_ER)) {
            	
                dp = new UnilateralDuplicatePropagation(gtReader.getDuplicatePairs(profilesD1));
            } else {
                dp = new BilateralDuplicatePropagation(gtReader.getDuplicatePairs(profilesD1, profilesD2));
            }
        }

        return dp;
    }
    
    
    /**
     * Construct the list of entities which will be displayed in the ground truth explore
     * 
     * @return the constructed list
     */
    public List<Pair<EntityProfileNode,EntityProfileNode>>  getDuplicates_GroundTruth(){
	    
	    List<Pair<EntityProfileNode,EntityProfileNode>> duplicates = new ArrayList<>();
	    
	    for (EquivalenceCluster ec : WorkflowManager.ground_truth.getRealEquivalenceClusters()) {
			if(WorkflowManager.er_mode.contentEquals(JedaiOptions.DIRTY_ER)){		
				//TODO: Ensure that the getEntityIds returns always a list with EXACTLY TWO items 
				if (!ec.getEntityIdsD1().isEmpty()) { 
					TIntList duplicate_list = ec.getEntityIdsD1();
					
					int id_1 = duplicate_list.get(0);
					int id_2 = duplicate_list.get(1);
					EntityProfileNode entity_1 = new EntityProfileNode(WorkflowManager.profilesD1.get(id_1), id_1);
					EntityProfileNode entity_2 = new EntityProfileNode(WorkflowManager.profilesD1.get(id_2), id_2);
					
					Pair<EntityProfileNode, EntityProfileNode> duplicate_pair = new Pair<EntityProfileNode, EntityProfileNode>(entity_1, entity_2);
					duplicates.add(duplicate_pair);		
				}
			}
			else {
				if (!ec.getEntityIdsD1().isEmpty() && !ec.getEntityIdsD2().isEmpty()) {
					//TODO: Ensure for this as well!
					// Get the two entities and add them manually (there are always exactly two)
					int id1 = ec.getEntityIdsD1().get(0);
					int id2 = ec.getEntityIdsD2().get(0);
					EntityProfileNode entity_1 = new EntityProfileNode(WorkflowManager.profilesD1.get(id1), id1);
					EntityProfileNode entity_2 = new EntityProfileNode(WorkflowManager.profilesD2.get(id2), id2);
					
					Pair<EntityProfileNode, EntityProfileNode> duplicate_pair = new Pair<EntityProfileNode, EntityProfileNode>(entity_1, entity_2);
					duplicates.add(duplicate_pair);					
				}
			}
		}
	
		return duplicates;
    }	
	

   // Getters and Setters 
   
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
