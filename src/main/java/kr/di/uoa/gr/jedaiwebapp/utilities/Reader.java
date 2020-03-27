package kr.di.uoa.gr.jedaiwebapp.utilities;

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

import gnu.trove.list.TIntList;
import kr.di.uoa.gr.jedaiwebapp.datatypes.EntityProfileNode;
import kr.di.uoa.gr.jedaiwebapp.models.Dataset;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.JedaiOptions;

public class Reader {
	private String filetype;
	private String filepath;
	private String url;
	
	private boolean first_row;
	private char separator;
	private int id_index;
	private int[] excluded;
	private String table;
	private String username;
	private String password;
	private boolean ssl;
	
	
	
	
	/**
	 * Constructor
	 * 
	 */
	public Reader(String filetype, String source, MultiValueMap<String, Object> configurations) throws Exception{
		
		this.filetype = filetype;
		ObjectMapper mapper = new ObjectMapper();
		switch (filetype) {
		case "Database":
			this.url = source;
			this.filepath = null;
			
			this.table =  ((String) configurations.getFirst("table")).replace("\"", "");
			this.username = ((String)  configurations.getFirst("username")).replace("\"", "");
	        this.password =  ((String) configurations.getFirst("password")).replace("\"", "");  
	        this.ssl =  Boolean.parseBoolean(((String) configurations.getFirst("ssl")).replace("\"", ""));
	        excluded = mapper.readValue((String) configurations.getFirst("excluded_attr"), int[].class);
	        break;
	        
		case "CSV":
			this.first_row = Boolean.parseBoolean(((String) configurations.getFirst("first_row")).replace("\"", ""));
			this.separator = ((String) configurations.getFirst("separator")).charAt(1);
			this.id_index = Integer.parseInt(((String) configurations.getFirst("id_index")).replace("\"", ""));
			
		case "RDF":
		case "XML":
			excluded = mapper.readValue((String) configurations.getFirst("excluded_attr"), int[].class);
			
		default:
			this.filepath = source;
			this.url = null;
		}
	}
	
	
	public Reader(Dataset dt) throws Exception{
		
		this.filetype = dt.getFiletype();
		switch (filetype) {
		case "Database":
			this.url = dt.getSource();
			this.filepath = null;
			
			this.table =  dt.getTableName();
			this.username = dt.getDbUsername();
	        this.password =  dt.getDbPassword();  
	        this.ssl =  dt.isSsl();
	        excluded = dt.getExcluded_attr();
	        break;
	        
		case "CSV":
			this.first_row = dt.getFirst_row();
			this.separator = dt.getSeparator();
			this.id_index = dt.getId_index();
			
		case "RDF":
		case "XML":
			excluded = dt.getExcluded_attr();
			
		default:
			this.filepath = dt.getSource();
			this.url = null;
		}
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
        String[] excluded_str = new String[excluded.length];
        for(int i=0; i<excluded_str.length; i++) excluded_str[i] = String.valueOf(excluded[i]);
        
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
        
        switch (filetype) {
            case JedaiOptions.CSV:
             
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
    public List<List<EntityProfileNode>> getDuplicates_GroundTruth(){
	    
	    List<List<EntityProfileNode>> duplicates = new ArrayList<>();
		if(WorkflowManager.er_mode.contentEquals(JedaiOptions.DIRTY_ER)){		
			 for (EquivalenceCluster ec : WorkflowManager.ground_truth.getRealEquivalenceClusters()) {
				 if (!ec.getEntityIdsD1().isEmpty()) { 
					TIntList duplicate_list = ec.getEntityIdsD1();
					List<EntityProfileNode> entity_duplicates = new ArrayList<>();
					for (int i = 0; i < duplicate_list.size(); i++){
						int id = duplicate_list.get(i);
						entity_duplicates.add(new EntityProfileNode(WorkflowManager.profilesD1.get(id), id));
					}
						
					if (entity_duplicates.size() > 1 )  duplicates.add(entity_duplicates);		
				}
			}
		}
		else {
			for (EquivalenceCluster ec : WorkflowManager.ground_truth.getRealEquivalenceClusters()) {
				if (!ec.getEntityIdsD1().isEmpty() && !ec.getEntityIdsD2().isEmpty()) {
					TIntList ids_1 = ec.getEntityIdsD1();
					TIntList ids_2 = ec.getEntityIdsD2();
					List<EntityProfileNode> entity_duplicates = new ArrayList<>();
					for (int i = 0; i < ids_1.size(); i++){
						int id = ids_1.get(i);
						entity_duplicates.add(new EntityProfileNode(WorkflowManager.profilesD1.get(id), id));
					}
					for (int i = 0; i < ids_2.size(); i++){
						int id = ids_2.get(i);
						entity_duplicates.add(new EntityProfileNode(WorkflowManager.profilesD2.get(id), id));
					}
					
					if (entity_duplicates.size() > 1 ) duplicates.add(entity_duplicates);					
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

}
