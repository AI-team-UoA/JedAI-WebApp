package kr.di.uoa.gr.jedaiwebapp.execution;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import kr.di.uoa.gr.jedaiwebapp.execution.WorkflowManager;
import kr.di.uoa.gr.jedaiwebapp.utilities.Reader;
import org.json.JSONArray;
import org.json.JSONObject;
import org.scify.jedai.datamodel.EntityProfile;

import kr.di.uoa.gr.jedaiwebapp.datatypes.EntityProfileNode;

public class StaticReader {

	public static Map<String, Object> datasetConf1 = null;
	public static Map<String, Object> datasetConf2 = null;
	public static Map<String, Object> datasetConfGT = null;
	public static List<EntityProfileNode> entityProfiles1 = null;
	public static List<EntityProfileNode> entityProfiles2 = null;
	public static List<List<EntityProfileNode>> duplicates = null;


	public static String setDataset(JSONObject configurations, String source) {

		try {
			if(! new File(source).exists())	return "";
			String entity_id = configurations.getString("entity_id");
			String filetype = configurations.getString("filetype");	
			Reader entity_profile = new Reader(filetype, source, configurations);

			switch (entity_id) {
				case "1":
					WorkflowManager.profilesD1 = entity_profile.read();
					entityProfiles1 = new ArrayList<>();
					// construct the dataset which will be displayed in explore
					for (int i = 0; i < WorkflowManager.profilesD1.size(); i++) {
						EntityProfile entity = WorkflowManager.profilesD1.get(i);
						EntityProfileNode entity_node = new EntityProfileNode(entity, i + 1);
						entityProfiles1.add(entity_node);
					}
					duplicates = null;
					WorkflowManager.ground_truth = null;
					break;

				case "2":
					WorkflowManager.profilesD2 = entity_profile.read();
					entityProfiles2 = new ArrayList<>();
					// construct the dataset which will be displayed in explore
					for (int i = 0; i < WorkflowManager.profilesD2.size(); i++) {
						EntityProfile entity = WorkflowManager.profilesD2.get(i);
						EntityProfileNode entity_node = new EntityProfileNode(entity, i + 1);
						entityProfiles2.add(entity_node);
					}
					duplicates = null;
					WorkflowManager.ground_truth = null;
					break;

				case "3":
					WorkflowManager.ground_truth = entity_profile.read_GroundTruth(WorkflowManager.er_mode,
							WorkflowManager.profilesD1, WorkflowManager.profilesD2);

					// construct the dataset which will be displayed in explore
					duplicates = entity_profile.getDuplicates_GroundTruth();
					break;
			}
			saveDatasetConf(source, filetype, entity_id, source, configurations);
			return source;
		} catch (Exception e) {
			e.printStackTrace();
			return "";
		}
	}

	

    public static boolean saveDatasetConf(String source, String filetype, String entity_id, String filename, JSONObject configurations){
	
		// adding dataset to the Dataset table 
		Map<String, Object> datasetConf = new HashMap<String, Object>();
		
		datasetConf.put("source", source);
		datasetConf.put("filetype", filetype);
		datasetConf.put("entity_id", entity_id);
		
		if (!filetype.equals("Database"))
			datasetConf.put("filename", filename);
		else
			datasetConf.put("filename", null);
		
		if(entity_id == "2") 
			datasetConf.put("type", "gt");
		else 
			datasetConf.put("type", "d");
		
		if(configurations.has("separator")){
			String strValue = configurations.getString("separator").replace("\"", "");
			if(strValue.length() > 0){ 
				String value = strValue;
				datasetConf.put("separator", value);   
			}
			else
				datasetConf.put("separator", "-");
		}
		else datasetConf.put("separator", "-");

		if(configurations.has("first_row")){
			boolean first_row = configurations.getBoolean("first_row");
			datasetConf.put("first_row", first_row);
		}
		else datasetConf.put("first_row", false);


		if(configurations.has("excluded_attr")){ //todo fix
			JSONArray jArray = configurations.getJSONArray("excluded_attr");
			if (jArray != null && jArray.length() > 0){
				int[] value = new int[jArray.length()]; 
				for (int i=0;i<jArray.length();i++)
					value[i] = jArray.getInt(i);
				
				datasetConf.put("excluded_attr", value);
			}
			else
				datasetConf.put("excluded_attr", null);
		}
		else datasetConf.put("excluded_attr", null);

		if(configurations.has("id_index"))
				datasetConf.put("id_index", configurations.getInt("id_index"));
		else
				datasetConf.put("id_index", -1);;

		if(configurations.has("table")){
			String strValue = configurations.getString("table").replace("\"", "");
			if(strValue.length() > 0){ 
				String value = strValue;
				datasetConf.put("table", value);
			}
			else
				datasetConf.put("table", null);
		}
		else datasetConf.put("table", null);

		if(configurations.has("username")){
			String strValue = configurations.getString("username").replace("\"", "");
			if(strValue.length() > 0){ 
				String value = strValue;
				datasetConf.put("username", value);
			}
			else
				datasetConf.put("username", null);
		}
		else datasetConf.put("username", null);

		if(configurations.has("password")){
			String strValue = configurations.getString("password").replace("\"", "");
			if(strValue.length() > 0){ 
				String value = strValue;
				datasetConf.put("password", value);
			}
			else
				datasetConf.put("password", null);
		}
		else datasetConf.put("password", null);

		if(configurations.has("ssl"))
			datasetConf.put("ssl", configurations.getBoolean("ssl"));
        else datasetConf.put("ssl", false);
        
        switch(entity_id){
            case "1": 
                datasetConf1 = datasetConf;
                break;
            case "2":
                datasetConf2 = datasetConf;
                break;
            case "3":
                datasetConfGT = datasetConf;
                break;
        }

		return  true;
    }
    


}