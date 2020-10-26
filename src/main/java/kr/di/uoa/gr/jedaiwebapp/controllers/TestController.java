package kr.di.uoa.gr.jedaiwebapp.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.di.uoa.gr.jedaiwebapp.utilities.StaticReader;
import kr.di.uoa.gr.jedaiwebapp.utilities.WorkflowManager;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.JedaiOptions;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.json.JSONObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/test/**")
public class TestController {
    
    @GetMapping("/test/get/{test_type}/{er_mode}/{wf_mode}/{dt_choice}")
    public String getTest(
                @PathVariable(value = "test_type") String test_type,
                @PathVariable(value = "er_mode") String er_mode,
                @PathVariable(value = "wf_mode") String wf_mode,
                @PathVariable(value = "dt_choice") String dt_choice){
                    
        System.out.println(test_type + " " + er_mode + " " + wf_mode + " " + dt_choice);
        WorkflowManager.clean();
        if (er_mode.equals("dirty"))
            WorkflowManager.er_mode = JedaiOptions.DIRTY_ER;
        else
            WorkflowManager.er_mode = JedaiOptions.CLEAN_CLEAN_ER;
                    
        try{
            String pathStr = "data/";
            if (test_type.equals(JedaiOptions.SCALING_TEST))
                pathStr += "Synthetic/";
            else if (er_mode.equals("dirty"))
                pathStr += "Dirty_ER/";
            else
                pathStr += "CleanClean_ER/";
            
            pathStr += dt_choice + "/";
            System.out.println(wf_mode);
            if(wf_mode.equals(JedaiOptions.BEST_WORKFLOW_BLOCKING_BASED)){
                pathStr += "bb_workflow_conf.json";
                WorkflowManager.wf_mode = JedaiOptions.WORKFLOW_BLOCKING_BASED;
            }
            else if(wf_mode.equals(JedaiOptions.DEFAULT_WORKFLOW_BLOCKING_BASED)){
                pathStr += "default_bb_workflow_conf.json";
                WorkflowManager.wf_mode = JedaiOptions.WORKFLOW_BLOCKING_BASED;
            }
            else if(wf_mode.equals(JedaiOptions.WORKFLOW_PROGRESSIVE)){
                pathStr += "pbb_workflow_conf.json";
                WorkflowManager.wf_mode = JedaiOptions.WORKFLOW_PROGRESSIVE;
            }
            else if(wf_mode.equals(JedaiOptions.WORKFLOW_RANDOM_PROGRESSIVE)){
                pathStr += "rpbb_workflow_conf.json";
                WorkflowManager.wf_mode = JedaiOptions.WORKFLOW_PROGRESSIVE;
            }
            else{
                pathStr += "sj_workflow_conf.json";
                WorkflowManager.wf_mode = JedaiOptions.WORKFLOW_JOIN_BASED;
            }

            System.out.println("Test path: " + pathStr);

            Path path = Paths.get(pathStr);
            String json_conf = String.join("\n", Files.readAllLines(path));

            JSONObject dataReadingConf = new JSONObject(json_conf).getJSONObject("data_reading");

            if (!dataReadingConf.isNull("entity1_set")){

                JSONObject entityConf1 = getDatasetConf(dataReadingConf.getJSONObject("entity1_set"));
                entityConf1.put("entity_id", "1");
                StaticReader.setDataset(entityConf1, null, null);
                
                if(WorkflowManager.er_mode.equals(JedaiOptions.CLEAN_CLEAN_ER)){
                    JSONObject entityConf2 = getDatasetConf(dataReadingConf.getJSONObject("entity2_set"));
                    entityConf2.put("entity_id", "2");
                    StaticReader.setDataset(entityConf2, null, null);
                }

                JSONObject gtConf = getDatasetConf(dataReadingConf.getJSONObject("groundTruth_set"));
                gtConf.put("entity_id", "3");
                StaticReader.setDataset(gtConf, null, null);
            }
            
            return json_conf; 
        }
        catch(IOException| SecurityException e){
            return null;
        }
    }

    public JSONObject getDatasetConf(JSONObject entityJS){
        JSONObject conf = new JSONObject();
        String filetype = entityJS.getString("filetype");
        conf.put("source", entityJS.getString("source"));
        conf.put("filetype", filetype);
        conf.put("filename", entityJS.getJSONObject("configurations").getString("filename"));
        conf.put("excluded_attr", entityJS.getJSONObject("configurations").getJSONArray("excluded_attr"));

        if (filetype.equals("CSV")){
            conf.put("first_row", entityJS.getJSONObject("configurations").getBoolean("first_row"));
            conf.put("separator", entityJS.getJSONObject("configurations").getString("separator"));
            conf.put("id_index", entityJS.getJSONObject("configurations").getInt("id_index"));
        }
        else if(filetype.equals("Database")){
            conf.put("first_row", entityJS.getJSONObject("configurations").getBoolean("ssl"));
            conf.put("separator", entityJS.getJSONObject("configurations").getString("table"));
            conf.put("id_index", entityJS.getJSONObject("configurations").getString("username")); 
            conf.put("id_index", entityJS.getJSONObject("configurations").getString("password")); 
        }
        return conf;
    }
}