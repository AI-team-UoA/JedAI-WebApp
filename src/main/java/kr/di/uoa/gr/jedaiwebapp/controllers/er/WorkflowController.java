package kr.di.uoa.gr.jedaiwebapp.controllers.er;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.scify.jedai.datawriter.ClustersPerformanceWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.di.uoa.gr.jedaiwebapp.datatypes.MethodModel;
import kr.di.uoa.gr.jedaiwebapp.datatypes.Parameter;
import kr.di.uoa.gr.jedaiwebapp.datatypes.SimilarityMethodModel;
import kr.di.uoa.gr.jedaiwebapp.models.Dataset;
import kr.di.uoa.gr.jedaiwebapp.models.MethodConfiguration;
import kr.di.uoa.gr.jedaiwebapp.models.SimilarityMethod;
import kr.di.uoa.gr.jedaiwebapp.models.WorkflowConfiguration;
import kr.di.uoa.gr.jedaiwebapp.utilities.DatabaseManager;
import kr.di.uoa.gr.jedaiwebapp.execution.er.StaticReader;
import kr.di.uoa.gr.jedaiwebapp.execution.er.WorkflowManager;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.JedaiOptions;



@RestController
@RequestMapping("/workflow/**")
public class WorkflowController {
	
	Map<String, Object> methodsConfig;	
	private WorkflowConfiguration workflowConfiguration;
	
	@Autowired
	private HttpServletRequest request;
	
	@Autowired
	private DatabaseManager dbm;

	
	WorkflowController(){
		methodsConfig = new HashMap<String, Object>();
	}
	

	@GetMapping("/workflow/get_configurations")
	public Map<String, Object> getWorkflowConfigurations(){	return methodsConfig; }
	
	
	@GetMapping("workflow/set_mode/{wf_mode}")
	public void setWorkflowMode(@PathVariable(value = "wf_mode") String wf_mode){ 
		WorkflowManager.wf_mode = wf_mode; 
	}

	/**
     * check the configurations of the data read step
     *
     * @return true if the configurations of data read ware set correctly 
     */	
	@GetMapping("/workflow/validate/dataread")	
	public boolean validateDataRead() {
		workflowConfiguration = new WorkflowConfiguration();
		methodsConfig = new HashMap<String, Object>();
		WorkflowManager.clean();
		
		methodsConfig.put("mode", WorkflowManager.er_mode); 

		if (StaticReader.datasetConfGT != null){
			Dataset gtd = new Dataset(StaticReader.datasetConfGT);
			methodsConfig.put("gt", gtd);
		}
		
		switch(WorkflowManager.er_mode) {
			
			case JedaiOptions.DIRTY_ER:
				workflowConfiguration.setErMode(JedaiOptions.DIRTY_ER);
				
				if(StaticReader.datasetConf1 == null) return false;
				Dataset dt = new Dataset(StaticReader.datasetConf1);
				methodsConfig.put("d1", dt);				
				return  WorkflowManager.profilesD1 != null;

			case JedaiOptions.CLEAN_CLEAN_ER:
				workflowConfiguration.setErMode(JedaiOptions.CLEAN_CLEAN_ER);

				if(StaticReader.datasetConf1 == null || StaticReader.datasetConf2 == null) return false;
				Dataset dt1 = new Dataset(StaticReader.datasetConf1);
				methodsConfig.put("d1", dt1);
				Dataset dt2 = new Dataset(StaticReader.datasetConf2);
				methodsConfig.put("d2", dt2);

				return  WorkflowManager.profilesD1 != null && WorkflowManager.profilesD2 != null;
			default:
				return false;
		}	
	}
	
	
	/**
     * Handle GET request and set the Entity Resolution mode
     *
     * @param er_mode the selected er mode
     * @return whether it was set successfully 
     */	
	@GetMapping("/workflow/set_configurations/ermode/{er_mode}")	
	public boolean getERMode(@PathVariable(value = "er_mode") String er_mode) {
		if (er_mode != null) {
			if (er_mode.equals("dirty"))
				WorkflowManager.er_mode = JedaiOptions.DIRTY_ER;
			else
				WorkflowManager.er_mode = JedaiOptions.CLEAN_CLEAN_ER;
		}
		return WorkflowManager.er_mode != null;		
	}
	
	
	
	/**
     * Handle POST request and set the schema clustering method
     *
     * @param schema_clustering the method and its configurations that the user has selected
     * @return whether it was set successfully 
     */	
	@PostMapping("/workflow/set_configurations/schemaclustering")	
	public boolean setSchemaClustering(@RequestBody MethodModel schema_clustering) {
		try {
			
			methodsConfig.put(JedaiOptions.SCHEMA_CLUSTERING, schema_clustering);
			
			WorkflowManager.setSchemaClustering(schema_clustering);
			
			// Adding method to DB
			// TODO to reduce lines -> constructors of models in their classes

			MethodConfiguration sc = new MethodConfiguration();
			sc.setMethod(JedaiOptions.SCHEMA_CLUSTERING);
			sc.setLabel(schema_clustering.getLabel());
			List<String> parameters = new ArrayList<>();
			for (Parameter p : schema_clustering.getParameters()) 
				parameters.add(p.getLabel() + "|" + p.getValue().toString());

			sc.setParameters(parameters);
			sc.setConfigurationType(schema_clustering.getConfiguration_type());
			dbm.storeOrUpdateMC(sc);

			workflowConfiguration.setSchemaClustering(sc.getId());
			
			return true;
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	
	/**
     * Handle POST request and set the comparison cleaning method
     *
     * @param comparison_cleaning the method and its configurations that the user has selected
     * @return whether it was set successfully 
     */	
	@PostMapping("/workflow/set_configurations/comparisoncleaning")	
	public boolean setComparisonCleaning(@RequestBody MethodModel comparison_cleaning) {
		
		try {
			methodsConfig.put(JedaiOptions.COMPARISON_CLEANING, comparison_cleaning);
			
			if (comparison_cleaning != null) {
				
				WorkflowManager.setComparisonCleaning(comparison_cleaning);
				
				// Adding method to DB
				MethodConfiguration cc = new MethodConfiguration();
				cc.setMethod(JedaiOptions.COMPARISON_CLEANING);
				cc.setLabel(comparison_cleaning.getLabel());
				List<String> parameters = new ArrayList<>();
				for (Parameter p : comparison_cleaning.getParameters()) 
					parameters.add(p.getLabel() + "|" + p.getValue().toString());

				cc.setParameters(parameters);
				cc.setConfigurationType(comparison_cleaning.getConfiguration_type());
				dbm.storeOrUpdateMC(cc);
				
				workflowConfiguration.setComparisonCleaning(cc.getId());				
			}
			return true;
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	
	/**
     * Handle POST request and set the entity matching method
     *
     * @param entity_matching the method and its configurations that the user has selected
     * @return whether it was set successfully 
     */	
	@PostMapping("/workflow/set_configurations/entitymatching")	
	public boolean setEntityMatching(@RequestBody MethodModel entity_matching) {
		
		try {
			methodsConfig.put(JedaiOptions.ENTITY_MATCHING, entity_matching);
			boolean done = WorkflowManager.setEntityMatching(entity_matching);			
			// Adding method to DB
			MethodConfiguration em = new MethodConfiguration();
			em.setMethod(JedaiOptions.ENTITY_MATCHING);
			em.setLabel(entity_matching.getLabel());
			List<String> parameters = new ArrayList<>();
			for (Parameter p : entity_matching.getParameters()) 
				parameters.add(p.getLabel() + "|" + p.getValue().toString());

			em.setParameters(parameters);
			em.setConfigurationType(entity_matching.getConfiguration_type());
			dbm.storeOrUpdateMC(em);
			
			workflowConfiguration.setEntityMatching(em.getId());
			return done;			
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
		
		
	}
	
	
	
	/**
     * Handle POST request and set the entity clustering method
     *
     * @param entity_clustering the method and its configurations that the user has selected
     * @return whether it was set successfully 
    */	
	@PostMapping("/workflow/set_configurations/entityclustering")	
	public boolean setEntityClustering(@RequestBody MethodModel entity_clustering) {
		
		try {
			methodsConfig.put(JedaiOptions.ENTITY_CLUSTERING, entity_clustering);
			
			WorkflowManager.setEntityClustering(entity_clustering);
			
			// Adding method to DB
			MethodConfiguration ec = new MethodConfiguration();
			ec.setMethod(JedaiOptions.ENTITY_CLUSTERING);
			ec.setLabel(entity_clustering.getLabel());
			List<String> parameters = new ArrayList<>();
			for (Parameter p : entity_clustering.getParameters()) 
				parameters.add(p.getLabel() + "|" + p.getValue().toString());

			ec.setParameters(parameters);
			ec.setConfigurationType(entity_clustering.getConfiguration_type());
			dbm.storeOrUpdateMC(ec);
			
			workflowConfiguration.setEntityClustering(ec.getId());			
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
		
		return true;
	}
	
	
	
	/**
     * Handle POST request and set the Block Building methods
     *
     * @param block_building a list of methods and their configurations, selected by the user
     * @return whether it was set successfully 
    */	
	@PostMapping("/set_configurations/blockbuilding")	
	public boolean setBlockBuilding(@RequestBody List<MethodModel> block_building) {

		try {
			int[] blockBuildingIDs = new int[block_building.size()];
			methodsConfig.put(JedaiOptions.BLOCK_BUILDING, block_building);
			int index = 0;
	        for (MethodModel method : block_building) {
	
	        	WorkflowManager.addBlockBuildingMethod(method);
	            
	            // Adding method to DB
				MethodConfiguration bb = new MethodConfiguration();
				bb.setMethod(JedaiOptions.BLOCK_BUILDING);
				bb.setLabel(method.getLabel());
				List<String> parameters = new ArrayList<>();
				for (Parameter p : method.getParameters()) 
					parameters.add(p.getLabel() + "|" + p.getValue().toString());

				bb.setParameters(parameters);
				bb.setConfigurationType(method.getConfiguration_type());
				dbm.storeOrUpdateMC(bb);
				blockBuildingIDs[index] = bb.getId();
				index++;				
	        }
	        workflowConfiguration.setBlockBuilding(blockBuildingIDs);
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
		        
		return true;
	}


	@PostMapping("/workflow/set_configurations/similarityjoin")
	public boolean setSimilarityJoinMethod(@RequestBody SimilarityMethodModel sj_method){
		try {
			
			WorkflowManager.setSimilarityJoinMethod(sj_method);
			methodsConfig.put(JedaiOptions.SIMILARITY_JOIN, sj_method);

			// Adding method to DB
			SimilarityMethod sjm = new SimilarityMethod();
			sjm.setLabel(sj_method.getLabel());
			List<String> parameters = new ArrayList<>();
			for (Parameter p : sj_method.getParameters()) 
				parameters.add(p.getLabel() + "|" + p.getValue().toString());

			sjm.setParameters(parameters);
			sjm.setAttribute1(sj_method.getAttribute1());
			sjm.setAttribute2(sj_method.getAttribute2());
			dbm.storeOrUpdateSJ(sjm);

			workflowConfiguration.setSimilarityJoin(sjm.getId());

			return true;
		}
		catch(Exception e){
			e.printStackTrace();
			return false;
		}
	}
	
	/**
     * Handle POST request and set the Block Cleaning methods
     *
     * @param block_cleaning a list of methods and their configurations, selected by the user
     * @return whether it was set successfully 
     */	
	@PostMapping("/set_configurations/blockcleaning")	
	public boolean setBlockCleaning(@RequestBody List<MethodModel> block_cleaning) {
		
		try {
			
			methodsConfig.put(JedaiOptions.BLOCK_CLEANING, block_cleaning);
			if(block_cleaning.size() != 0) {
				int[] blockCleaningIDs = new int[block_cleaning.size()];
				WorkflowManager.block_cleaning = new ArrayList<>();
				int index = 0;
		        for (MethodModel method : block_cleaning) {
		          
		           WorkflowManager.addBlockCleaningMethod(method);
		            
		            // Adding method to DB
					MethodConfiguration bc = new MethodConfiguration();
					bc.setMethod(JedaiOptions.BLOCK_CLEANING);
					bc.setLabel(method.getLabel());
					List<String> parameters = new ArrayList<>();
					for (Parameter p : method.getParameters()) 
						parameters.add(p.getLabel() + "|" + p.getValue().toString());

					bc.setParameters(parameters);
					bc.setConfigurationType(method.getConfiguration_type());
					dbm.storeOrUpdateMC(bc);
					blockCleaningIDs[index] = bc.getId();
					index++;				
		            
		        }		        
		        workflowConfiguration.setBlockCleaning(blockCleaningIDs);
		        return true;
			}
			else return true;
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	@PostMapping("/workflow/set_configurations/prioritization")
	public boolean setPrioritization(@RequestBody MethodModel prioritization_method){
		try{
			for (Parameter p : prioritization_method.getParameters()){
				if (p.getLabel().equals("Budget")){
					Integer.parseInt((String)p.getValue()); //check if it's integer
				}
			}
			WorkflowManager.setPrioritizationMethod(prioritization_method);
			methodsConfig.put(JedaiOptions.PRIORITIZATION, prioritization_method);
			
			// Adding method to DB
			MethodConfiguration pm = new MethodConfiguration();
			pm.setMethod(JedaiOptions.PRIORITIZATION);
			pm.setLabel(prioritization_method.getLabel());
			List<String> parameters = new ArrayList<>();
			for (Parameter p : prioritization_method.getParameters()) 
				parameters.add(p.getLabel() + "|" + p.getValue().toString());

			pm.setParameters(parameters);
			pm.setConfigurationType(prioritization_method.getConfiguration_type());
			dbm.storeOrUpdateMC(pm);
			
			workflowConfiguration.setPrioritization(pm.getId());			

			return true;
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	
	
	
	/**
     * Construct and return file containing the performance of the Workflow execution
     *
     * @param filetype the type of the file
     * @return stream of data which will be downloaded as file
     */
	@GetMapping("/workflow/export/{filetype}")
	public void exportResults(@PathVariable(value = "filetype") String filetype,
			HttpServletResponse response) {
		try {
			// construct file
			String export_path = null;
			String export_dir =  request.getServletContext().getRealPath("/exports");
			if(! new File(export_dir).exists())
				new File(export_dir).mkdir();
	            
	        switch (filetype) {
	            case JedaiOptions.CSV:
	                export_path = export_dir+"/workflow_results.csv";
	                response.setContentType("application/csv");
	                break;
	            case JedaiOptions.XML:
	            case JedaiOptions.RDF:
	            	export_path = export_dir+"/workflow_results.xml";
	            	response.setContentType("application/xml");
	                break;        
	        }
	        File export_file = new File(export_path);
	        if (!export_file.exists()) 
	        	export_file.createNewFile();
			
			if (WorkflowManager.ground_truth == null)
				WorkflowManager.exportToCSV(export_path);
			else{
				// Construct file containing the results of the execution
				ClustersPerformanceWriter cpw = new ClustersPerformanceWriter(
						WorkflowManager.getEntityClusters(),
						WorkflowManager.ground_truth);
						
				switch (filetype) {
					case JedaiOptions.CSV:
						// Output CSV
						cpw.printDetailedResultsToCSV(WorkflowManager.profilesD1, WorkflowManager.profilesD2,export_path);
						break;
					case JedaiOptions.XML:
						cpw.printDetailedResultsToXML(WorkflowManager.profilesD1, WorkflowManager.profilesD2,
								export_path);
						break;
					case JedaiOptions.RDF:
						cpw.printDetailedResultsToRDF(WorkflowManager.profilesD1, WorkflowManager.profilesD2,
								export_path);
						break;
				}
			}
					
	       	// Insert the stream to the response
			response.setHeader(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=\"" + export_file.getName() + "\"");
		    // get your file as InputStream
		    InputStream exported_is =  new FileInputStream(export_file);		   
		    // copy it to response's OutputStream
		    org.apache.commons.io.IOUtils.copy(exported_is, response.getOutputStream());
		    
		    response.flushBuffer();
		}
		catch (IOException ex) {
			ex.printStackTrace();
		}
	}
	
	
	@GetMapping("/workflow/store")
	public boolean storeWorkflow() {
		try {
			workflowConfiguration.setWfMode(WorkflowManager.wf_mode);
			Dataset dt1 = (Dataset) methodsConfig.get("d1");
			dbm.storeOrUpdateDataset(dt1);
			workflowConfiguration.setDatasetID1(dt1.getId());
			if (WorkflowManager.er_mode.equals(JedaiOptions.CLEAN_CLEAN_ER)){
				Dataset dt2 = (Dataset) methodsConfig.get("d2");
				dbm.storeOrUpdateDataset(dt2);
				workflowConfiguration.setDatasetID2(dt2.getId());
			}
			if (methodsConfig.containsKey("gt")){
				Dataset dtgt = (Dataset) methodsConfig.get("gt");
				dbm.storeOrUpdateDataset(dtgt);
				workflowConfiguration.setGtID(dtgt.getId());
			}
			
			dbm.storeOrUpdateWC(workflowConfiguration);
			WorkflowManager.workflowConfigurationsID = workflowConfiguration.getId();
			return true;
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}


}
