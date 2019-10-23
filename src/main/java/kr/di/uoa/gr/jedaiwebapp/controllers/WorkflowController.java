package kr.di.uoa.gr.jedaiwebapp.controllers;


import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.scify.jedai.blockbuilding.IBlockBuilding;
import org.scify.jedai.blockprocessing.IBlockProcessing;
import org.scify.jedai.datawriter.ClustersPerformanceWriter;
import org.scify.jedai.utilities.enumerations.BlockBuildingMethod;
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
import kr.di.uoa.gr.jedaiwebapp.models.Dataset;
import kr.di.uoa.gr.jedaiwebapp.models.DatasetRepository;
import kr.di.uoa.gr.jedaiwebapp.models.MethodConfiguration;
import kr.di.uoa.gr.jedaiwebapp.models.MethodConfigurationRepository;
import kr.di.uoa.gr.jedaiwebapp.models.WorkflowConfiguration;
import kr.di.uoa.gr.jedaiwebapp.models.WorkflowConfigurationRepository;
import kr.di.uoa.gr.jedaiwebapp.utilities.WorkflowManager;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.DynamicMethodConfiguration;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.JedaiOptions;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.MethodConfigurations;



@RestController
@RequestMapping("/workflow/**")
public class WorkflowController {
	
	
	static Map<String, Object> methodsConfig;	
	static List<Map<String, Object>> datasetsConfig = new ArrayList<Map<String, Object>>();
	private WorkflowConfiguration workflowConfiguration;
	
	@Autowired
	private DatasetRepository datasetRepository;
	
	@Autowired
	private MethodConfigurationRepository methodConfigurationRepository;
	
	@Autowired
	private WorkflowConfigurationRepository workflowConfigurationRepository;
	
	@Autowired
	private HttpServletRequest request;
	
	WorkflowController(){
		WorkflowController.methodsConfig = new HashMap<String, Object>();
	}
	
	
	/**
     * check the configurations of the data read step
     *
     * @return true if the configurations of data read ware set correctly 
     */	
	@GetMapping("/workflow/validate/dataread")	
	public boolean validate_DataRead() {
		workflowConfiguration = new WorkflowConfiguration();
		WorkflowManager.clean();
		
		switch(WorkflowManager.er_mode) {
			case JedaiOptions.DIRTY_ER:
				workflowConfiguration.setErMode(JedaiOptions.DIRTY_ER);
				return  WorkflowManager.profilesD1 != null && WorkflowManager.ground_truth != null;
			case JedaiOptions.CLEAN_CLEAN_ER:
				workflowConfiguration.setErMode(JedaiOptions.CLEAN_CLEAN_ER);
				return  WorkflowManager.profilesD1 != null && WorkflowManager.profilesD2 != null && WorkflowManager.ground_truth != null;
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
			if (!schema_clustering.getLabel().equals(JedaiOptions.NO_SCHEMA_CLUSTERING)) {
				
				if(!schema_clustering.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 			
					WorkflowManager.schema_clustering = MethodConfigurations.getSchemaClusteringMethodByName(schema_clustering.getLabel());
				else
					WorkflowManager.schema_clustering = DynamicMethodConfiguration.configureSchemaClusteringMethod(
							schema_clustering.getLabel(),
							schema_clustering.getParameters());
		                    
				System.out.println("SC: " + WorkflowManager.schema_clustering);
			}	
			// Adding method to DB
			MethodConfiguration sc = new MethodConfiguration();
			sc.setMethod(JedaiOptions.SCHEMA_CLUSTERING);
			sc.setLabel(schema_clustering.getLabel());
			List<String> parameters = new ArrayList<>();
			for (Parameter p : schema_clustering.getParameters()) 
				parameters.add(p.getLabel() + "|" + p.getValue().toString());

			sc.setParameters(parameters);
			sc.setConfigurationType(schema_clustering.getConfiguration_type());
			methodConfigurationRepository.save(sc);
			
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
				if (!comparison_cleaning.getLabel().equals(JedaiOptions.NO_CLEANING)) {
					if(!comparison_cleaning.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 	
							WorkflowManager.comparison_cleaning = MethodConfigurations.getMethodByName(comparison_cleaning.getLabel());
					else 
						WorkflowManager.comparison_cleaning = DynamicMethodConfiguration.configureComparisonCleaningMethod(
	            			comparison_cleaning.getLabel(),
	            			comparison_cleaning.getParameters() );
				}
			
				// Adding method to DB
				MethodConfiguration cc = new MethodConfiguration();
				cc.setMethod(JedaiOptions.COMPARISON_CLEANING);
				cc.setLabel(comparison_cleaning.getLabel());
				List<String> parameters = new ArrayList<>();
				for (Parameter p : comparison_cleaning.getParameters()) 
					parameters.add(p.getLabel() + "|" + p.getValue().toString());

				cc.setParameters(parameters);
				cc.setConfigurationType(comparison_cleaning.getConfiguration_type());
				methodConfigurationRepository.save(cc);
				
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
     * Handle POST request and set the entity mathcing method
     *
     * @param entity_matching the method and its configurations that the user has selected
     * @return whether it was set successfully 
     */	
	@PostMapping("/workflow/set_configurations/entitymatching")	
	public boolean setEntityMatching(@RequestBody MethodModel entity_matching) {
		
		try {
			methodsConfig.put(JedaiOptions.ENTITY_MATHCING, entity_matching);
			
			if(!entity_matching.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 	
				WorkflowManager.entity_matching = DynamicMethodConfiguration
	                    .configureEntityMatchingMethod(entity_matching.getLabel(), null);
	         else 
	        	 WorkflowManager.entity_matching = DynamicMethodConfiguration
	                    .configureEntityMatchingMethod(entity_matching.getLabel(), entity_matching.getParameters());
	        
			System.out.println("EM: " + WorkflowManager.entity_matching);
			
			// Adding method to DB
			MethodConfiguration em = new MethodConfiguration();
			em.setMethod(JedaiOptions.ENTITY_MATHCING);
			em.setLabel(entity_matching.getLabel());
			List<String> parameters = new ArrayList<>();
			for (Parameter p : entity_matching.getParameters()) 
				parameters.add(p.getLabel() + "|" + p.getValue().toString());

			em.setParameters(parameters);
			em.setConfigurationType(entity_matching.getConfiguration_type());
			methodConfigurationRepository.save(em);
			
			workflowConfiguration.setEntityMatching(em.getId());			
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
		
		return WorkflowManager.entity_matching != null;
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
			
			if(!entity_clustering.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 
				WorkflowManager.entity_clustering = MethodConfigurations.getEntityClusteringMethod(entity_clustering.getLabel());
	         else 
	        	 WorkflowManager.entity_clustering = DynamicMethodConfiguration.configureEntityClusteringMethod(entity_clustering.getLabel(), entity_clustering.getParameters());
	        
			System.out.println("EC: " + WorkflowManager.entity_clustering);
			
			// Adding method to DB
			MethodConfiguration ec = new MethodConfiguration();
			ec.setMethod(JedaiOptions.ENTITY_CLUSTERING);
			ec.setLabel(entity_clustering.getLabel());
			List<String> parameters = new ArrayList<>();
			for (Parameter p : entity_clustering.getParameters()) 
				parameters.add(p.getLabel() + "|" + p.getValue().toString());

			ec.setParameters(parameters);
			ec.setConfigurationType(entity_clustering.getConfiguration_type());
			methodConfigurationRepository.save(ec);
			
			workflowConfiguration.setEntityClustering(ec.getId());			
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
		
		return WorkflowManager.entity_clustering != null;
	}
	
	
	
	/**
     * Handle POST request and set the Block Building methods
     *
     * @param block_building a list of methods and their configurations, selected by the user
     * @return whether it was set successfully 
    */	
	@PostMapping("/set_configurations/blockbuilding")	
	public boolean setBlockBuilding(@RequestBody List<MethodModel> block_building) {
		
		if (block_building.size() == 0) return false;
		try {
			int[] blockBuildingIDs = new int[block_building.size()];
			methodsConfig.put(JedaiOptions.BLOCK_BUILDING, block_building);
			WorkflowManager.block_building = new ArrayList<>();
			int inedx = 0;
	        for (MethodModel method : block_building) {
	
	        	BlockBuildingMethod blockBuilding_method = MethodConfigurations.blockBuildingMethods.get(method.getLabel());
	           
	            IBlockBuilding blockBuildingMethod;
	            if (!method.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 
	                
	                blockBuildingMethod = BlockBuildingMethod.getDefaultConfiguration(blockBuilding_method);
	             else 
	            	 blockBuildingMethod = DynamicMethodConfiguration.configureBlockBuildingMethod(blockBuilding_method, method.getParameters());
	            
	            WorkflowManager.block_building.add(blockBuildingMethod);
	            
	            // Adding method to DB
				MethodConfiguration bb = new MethodConfiguration();
				bb.setMethod(JedaiOptions.BLOCK_BUILDING);
				bb.setLabel(method.getLabel());
				List<String> parameters = new ArrayList<>();
				for (Parameter p : method.getParameters()) 
					parameters.add(p.getLabel() + "|" + p.getValue().toString());

				bb.setParameters(parameters);
				bb.setConfigurationType(method.getConfiguration_type());
				methodConfigurationRepository.save(bb);
				blockBuildingIDs[inedx] = bb.getId();
				inedx++;				
	        }
	        workflowConfiguration.setBlockBuilding(blockBuildingIDs);
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
		        
		return WorkflowManager.block_building != null;
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
		          
		            IBlockProcessing blockCleaning_method;
		            if (!method.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 
		            	blockCleaning_method = MethodConfigurations.getMethodByName(method.getLabel());
		             else 
		            	 blockCleaning_method = DynamicMethodConfiguration.configureBlockCleaningMethod(
		                		method.getLabel(), method.getParameters());
	
		            WorkflowManager.block_cleaning.add(blockCleaning_method);
		            
		            // Adding method to DB
					MethodConfiguration bc = new MethodConfiguration();
					bc.setMethod(JedaiOptions.BLOCK_CLEANING);
					bc.setLabel(method.getLabel());
					List<String> parameters = new ArrayList<>();
					for (Parameter p : method.getParameters()) 
						parameters.add(p.getLabel() + "|" + p.getValue().toString());

					bc.setParameters(parameters);
					bc.setConfigurationType(method.getConfiguration_type());
					methodConfigurationRepository.save(bc);
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
	        
	        // Construct file containing the results of the execution
	       	ClustersPerformanceWriter cpw = new ClustersPerformanceWriter(
                    WorkflowManager.getEntityClusters(),
                    WorkflowManager.ground_truth);
	        	       
			switch (filetype) {
	            case JedaiOptions.CSV:
	                // Output CSV
	                cpw.printDetailedResultsToCSV(WorkflowManager.profilesD1, WorkflowManager.profilesD2,
	                		export_path);
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
	public void storeWorkflow() {
		for (Map<String, Object> datasetConfig : datasetsConfig) {
			Dataset dt = new Dataset(datasetConfig);
			datasetRepository.save(dt);
			String entityID = dt.getEntity_id();
			switch (entityID) {
				case "1": 
					workflowConfiguration.setDatasetID1(dt.getId());
				case "2": 
					workflowConfiguration.setDatasetID2(dt.getId());
				case "3": 
					workflowConfiguration.setGtID(dt.getId());
			}
		}
		
		workflowConfigurationRepository.save(workflowConfiguration);
		
		WorkflowManager.workflowConfigurationsID = workflowConfiguration.getId();
	}
	
	

}
