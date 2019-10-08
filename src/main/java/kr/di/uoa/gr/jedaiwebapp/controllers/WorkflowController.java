package kr.di.uoa.gr.jedaiwebapp.controllers;


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

import org.javatuples.Pair;
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

import kr.di.uoa.gr.jedaiwebapp.models.EntityProfileNode;
import kr.di.uoa.gr.jedaiwebapp.models.MethodModel;
import kr.di.uoa.gr.jedaiwebapp.utilities.WorkflowManager;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.DynamicMethodConfiguration;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.JedaiOptions;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.MethodConfigurations;



@RestController
@RequestMapping("/workflow/**")
public class WorkflowController {
	
	@Autowired
	private HttpServletRequest request;
	static Map<String, Object> methodsConfig;	
	
	
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

		switch(WorkflowManager.er_mode) {
			case JedaiOptions.DIRTY_ER:
				return  WorkflowManager.profilesD1 != null && WorkflowManager.ground_truth != null;
			case JedaiOptions.CLEAN_CLEAN_ER:
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
			
			if (schema_clustering.getLabel().equals(JedaiOptions.NO_SCHEMA_CLUSTERING)) return true;
			
			if(!schema_clustering.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 			
				WorkflowManager.schema_clustering = MethodConfigurations.getSchemaClusteringMethodByName(schema_clustering.getLabel());
			else
				WorkflowManager.schema_clustering = DynamicMethodConfiguration.configureSchemaClusteringMethod(
						schema_clustering.getLabel(),
						schema_clustering.getParameters());
	                    
			
			System.out.println("SC: " + WorkflowManager.schema_clustering);
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
		return WorkflowManager.schema_clustering != null;
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
			
			//TODO WARNING
			if (comparison_cleaning.getLabel().equals(JedaiOptions.NO_CLEANING)) return true;
			
			if (comparison_cleaning != null) {
				if(!comparison_cleaning.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 	
	                
					WorkflowManager.comparison_cleaning = MethodConfigurations.getMethodByName(comparison_cleaning.getLabel());
	             else 
	                
	            	 WorkflowManager.comparison_cleaning = DynamicMethodConfiguration.configureComparisonCleaningMethod(
	            			comparison_cleaning.getLabel(),
	            			comparison_cleaning.getParameters() );
	        }
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
			
		System.out.println("CC: " + WorkflowManager.comparison_cleaning);
		return WorkflowManager.comparison_cleaning != null;
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
			methodsConfig.put(JedaiOptions.BLOCK_BUILDING, block_building);
			
			WorkflowManager.block_building = new ArrayList<>();
	        for (MethodModel method : block_building) {
	
	        	BlockBuildingMethod blockBuilding_method = MethodConfigurations.blockBuildingMethods.get(method.getLabel());
	           
	            IBlockBuilding blockBuildingMethod;
	            if (!method.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 
	                
	                blockBuildingMethod = BlockBuildingMethod.getDefaultConfiguration(blockBuilding_method);
	             else 
	            	 blockBuildingMethod = DynamicMethodConfiguration.configureBlockBuildingMethod(blockBuilding_method, method.getParameters());
	            
	
	            WorkflowManager.block_building.add(blockBuildingMethod);
	        }
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
			
			if(block_cleaning.size() == 0) return true;
			
			WorkflowManager.block_cleaning = new ArrayList<>();
	        for (MethodModel method : block_cleaning) {
	          
	            IBlockProcessing blockCleaning_method;
	            if (!method.getConfiguration_type().equals(JedaiOptions.MANUAL_CONFIG)) 
	            	blockCleaning_method = MethodConfigurations.getMethodByName(method.getLabel());
	             else 
	            	 blockCleaning_method = DynamicMethodConfiguration.configureBlockCleaningMethod(
	                		method.getLabel(), method.getParameters());

	            WorkflowManager.block_cleaning.add(blockCleaning_method);
	        }
		}
		catch(Exception e) {
			e.printStackTrace();
			return false;
		}
				
		return WorkflowManager.block_cleaning != null;
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
	
	

}
