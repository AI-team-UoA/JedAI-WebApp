package kr.di.uoa.gr.jedaiwebapp.controllers;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

import javax.servlet.http.HttpServletResponse;

import org.javatuples.Pair;
import org.javatuples.Triplet;
import org.scify.jedai.utilities.BlocksPerformance;
import org.scify.jedai.utilities.ClustersPerformance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import kr.di.uoa.gr.jedaiwebapp.datatypes.EntityProfileNode;
import kr.di.uoa.gr.jedaiwebapp.datatypes.MethodModel;
import kr.di.uoa.gr.jedaiwebapp.datatypes.SimilarityMethodModel;
import kr.di.uoa.gr.jedaiwebapp.models.Dataset;
import kr.di.uoa.gr.jedaiwebapp.models.WorkflowResults;
import kr.di.uoa.gr.jedaiwebapp.utilities.DatabaseManager;
import kr.di.uoa.gr.jedaiwebapp.utilities.Reader;
import kr.di.uoa.gr.jedaiwebapp.utilities.SSE_Manager;
import kr.di.uoa.gr.jedaiwebapp.utilities.WorkflowManager;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.JedaiOptions;
import kr.di.uoa.gr.jedaiwebapp.utilities.workflows.BlockingWF;
import kr.di.uoa.gr.jedaiwebapp.utilities.workflows.JoinWF;
import kr.di.uoa.gr.jedaiwebapp.utilities.workflows.ProgressiveWF;


@RestController
@RequestMapping("/workflow/**")
public class ExecutionController {
	
	private final static int NO_OF_TRIALS = 100;
	private ExecutorService exec ;
	private static AtomicBoolean interrupt_execution;
	private Map<String, Object> methodsConfig;
	private SSE_Manager sse_manager;
	private List<List<EntityProfileNode>> detected_duplicates;
	private int entities_per_page = 5;

	@Autowired
	private DatabaseManager dbm;
	
	ExecutionController(){
		exec = Executors.newSingleThreadExecutor();
		interrupt_execution = new AtomicBoolean(false);
		sse_manager = new SSE_Manager();
		if (WorkflowManager.workflowConfigurationsID != -1 )
			methodsConfig = getWorkflowConfigurations(WorkflowManager.workflowConfigurationsID);	
	}
	
	
	
	
	/**
	 * Initialize the emitter which will be used in the SSE 
	 *
	 */
	@GetMapping("/workflow/sse")	
	public SseEmitter getEmitter(HttpServletResponse response) {
	    response.setHeader("Cache-Control", "no-store");

	    SseEmitter emitter = new SseEmitter();
	    sse_manager.setEmitter(emitter);
	     
	    return emitter;
	}
	
	/**
	 * 
	 * @return the ID of the current workflow
	 */
	@GetMapping("/workflow/id")
	public int getWorkflowID() {return WorkflowManager.workflowConfigurationsID;}
	
	
	/**
	 * 
	 * @param wfID workflow ID
	 * @return a map containing the configurations of a requested workflow
	 */
	@GetMapping("/workflow/get_configurations/{id}")		
	public Map<String, Object> getWorkflowConfigurations(@PathVariable(value = "id") int wfID) {
		try {
			if (dbm.existsWC(wfID))
				return dbm.getWorkflowConfigurations(wfID);
			else
				return null;
		}
		catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	
	/**
	 * Set to WorkflowManager the requested workflow
	 *  
	 * @param wfID workflow ID
	 * @return the results of the requested workflow
	 */
	@GetMapping("/workflow/set_workflow/{id}")
	public WorkflowResults setWorkflow(@PathVariable(value = "id") int wfID) {
		try {
			WorkflowManager.clean();
			Map<String, Object> wfConfig = dbm.getWorkflowConfigurations(wfID);
			WorkflowManager.workflowConfigurationsID = wfID;
			String erMode = (String) wfConfig.get("mode");
			
			Reader reader1 = new Reader((Dataset) wfConfig.get("d1"));
			WorkflowManager.profilesD1 = reader1.read();
			if(erMode.equals(JedaiOptions.CLEAN_CLEAN_ER)) {
				Reader reader2 = new Reader((Dataset) wfConfig.get("d2"));
				WorkflowManager.profilesD2 = reader2.read();
			}
			Reader gtReader = new Reader((Dataset) wfConfig.get("gt"));
			WorkflowManager.ground_truth = gtReader.read_GroundTruth(WorkflowManager.er_mode,
					WorkflowManager.profilesD1,
					WorkflowManager.profilesD2);
			
			WorkflowManager.wf_mode = (String) wfConfig.get("wfmode");
	
			switch (WorkflowManager.wf_mode) {
				case JedaiOptions.WORKFLOW_PROGRESSIVE:
					WorkflowManager.setPrioritizationMethod((MethodModel) wfConfig.get(JedaiOptions.PRIORITIZATION));
				case JedaiOptions.WORKFLOW_BLOCKING_BASED:
							
					WorkflowManager.setSchemaClustering((MethodModel) wfConfig.get(JedaiOptions.SCHEMA_CLUSTERING));
					
					List<MethodModel> bb = (List<MethodModel>) wfConfig.get(JedaiOptions.BLOCK_BUILDING);
					for (MethodModel m : bb) WorkflowManager.addBlockBuildingMethod(m);
					
					if (wfConfig.containsKey(JedaiOptions.BLOCK_CLEANING)){
						List<MethodModel> bc = (List<MethodModel>) wfConfig.get(JedaiOptions.BLOCK_CLEANING);
						for (MethodModel m : bc) WorkflowManager.addBlockCleaningMethod(m);
					}
					
					WorkflowManager.setComparisonCleaning((MethodModel) wfConfig.get(JedaiOptions.COMPARISON_CLEANING));
					WorkflowManager.setEntityMatching((MethodModel) wfConfig.get(JedaiOptions.ENTITY_MATCHING));
					WorkflowManager.setEntityClustering((MethodModel) wfConfig.get(JedaiOptions.ENTITY_CLUSTERING));
					break;

				case JedaiOptions.WORKFLOW_JOIN_BASED:

					WorkflowManager.setSimilarityJoinMethod((SimilarityMethodModel) wfConfig.get(JedaiOptions.SIMILARITY_JOIN));
					WorkflowManager.setEntityClustering((MethodModel) wfConfig.get(JedaiOptions.ENTITY_CLUSTERING));
					break;
									
			}

			return dbm.findWRByWCID(wfID);
		}
		catch(Exception e) {
			e.printStackTrace();
			WorkflowManager.setErrorMessage(e.getMessage());
			return null;
		}
	}
		
	
    
	/**
     * Set the detected duplicate dataset
     * 
     * @return the number o pages
     */
	@GetMapping("/workflow/{id}/explore")
	public int setExplore(){
		detected_duplicates = WorkflowManager.getDetectedDuplicates();
		return detected_duplicates.size()/entities_per_page;
	}
	
	
	
	/**
     * Calculate and return the instances for the requested page.
     * The instances will be displayed in the Explore window
     * 
     * @return the instances for the requested page.
     */
	@GetMapping("/workflow/{id}/explore/{page}")
	public List<List<EntityProfileNode>> getExploreSubset(@PathVariable(value = "page") String page){
		if (detected_duplicates == null) return null;
		int int_page = Integer.parseInt(page);
		int start = (int_page - 1) * entities_per_page;
		int end = start + entities_per_page;
		if (detected_duplicates.size() > 0) {
			if (end > detected_duplicates.size())
				end = detected_duplicates.size();
			return detected_duplicates.subList(start, end);
		}
		else return null;
	}	
	
	
	/**
	 *  
	 * Check if the configurations of the workflow have been set correctly.
	 * */	
	public boolean configurationsSetCorrectly() {
		if (WorkflowManager.er_mode == null || WorkflowManager.wf_mode == null) return false;
		
		boolean datasetOk;
		if (WorkflowManager.er_mode.equals(JedaiOptions.DIRTY_ER))
			datasetOk = WorkflowManager.profilesD1 != null && WorkflowManager.ground_truth != null;
		else
			datasetOk = WorkflowManager.profilesD1 != null && WorkflowManager.profilesD2 != null 
			&& WorkflowManager.ground_truth != null;

		switch(WorkflowManager.wf_mode){
			case JedaiOptions.WORKFLOW_PROGRESSIVE: //TODO : some progressive alg dont need blocking 
				return datasetOk && ProgressiveWF.configurationOk();

			case JedaiOptions.WORKFLOW_BLOCKING_BASED:
				return datasetOk && BlockingWF.configurationOk();
			
			case JedaiOptions.WORKFLOW_JOIN_BASED:
				return datasetOk && JoinWF.configurationOk();
			default:
				return false;
		}
	}
	
	/**
	 *  
	 * kill the thread that executes the workflow
	 * */	
	@GetMapping("/workflow/stop/")
	public void stopExecution() { interrupt_execution.set(true);	}
			
		
	/**
	 *  
	 * @return true if any configurations has been set to automatic
	 * */	
	@GetMapping("/workflow/automatic_conf/")
	public boolean getAutomaticIsSet() { return anyAutomaticConfig(); }
	

	/**
	 *  
	 * @return true if any configurations has been set to automatic
	 * */	
	@GetMapping("/workflow/roc/")
	public List<Double> returnRecall() { 
		
		return ProgressiveWF.recallCurve;
	 }
		
	
	
	/**
	 * Check if any automatic configuration has been set
	 * 
	 * @return true if any configurations has been set to automatic
	 * */
	public boolean anyAutomaticConfig() {
		
		boolean automatic_conf = false;
		
		if (this.methodsConfig == null)
			this.methodsConfig = getWorkflowConfigurations(WorkflowManager.workflowConfigurationsID);
		
		 for (String key : methodsConfig.keySet())  {
			 Object value = methodsConfig.get(key);
			 if (value instanceof MethodModel ) {
				 String conf = ((MethodModel) value).getConfiguration_type();
				 automatic_conf = automatic_conf || conf.equals(JedaiOptions.AUTOMATIC_CONFIG);
						 
			 }
			 else if (value instanceof List ) {
				 for (MethodModel method : (List<MethodModel>) value) {
					 String conf = method.getConfiguration_type();
					 automatic_conf = automatic_conf || conf.equals(JedaiOptions.AUTOMATIC_CONFIG);					 
				 }
			 }
		 }
		
		 return automatic_conf;	
	}


	
	
	/**
     * The method is triggered when the used presses the "Execute Workflow" button.
     * Firstly set the parameters if the configuration type of any method is automatic. 
     * Then execute the Work Flow.
     *
     * @param automatic_type Holistic or Step-by-step
     * @param search_type 
     * @return  
     */		
	@GetMapping("/workflow/execution/automatic_type/{automatic_type}/search_type/{search_type}")	
	public Triplet<ClustersPerformance, Double, Integer> executeWorkflow(
			@PathVariable(value = "automatic_type") String automatic_type,
			@PathVariable(value = "search_type") String search_type) {
		try {
			
			if (!configurationsSetCorrectly()) {
				WorkflowManager.setErrorMessage("The configurations have not been set correctly!");
				return null;
			}			
			
			interrupt_execution.set(false);
			
			int no_instances = 0;
			if (WorkflowManager.er_mode.equals(JedaiOptions.DIRTY_ER))
				no_instances = WorkflowManager.profilesD1.size();
			else
				no_instances = WorkflowManager.profilesD1.size() + WorkflowManager.profilesD2.size();
			
			Pair<ClustersPerformance, List<Triplet<String, BlocksPerformance, Double>>> performances = null;
			ClustersPerformance clp = null;
			List<Triplet<String, BlocksPerformance, Double>> blocksMethodsPerformances = null;
			
			double start_time = System.currentTimeMillis();
			
			if(this.anyAutomaticConfig()) {
				if(automatic_type.equals(JedaiOptions.AUTOCONFIG_HOLISTIC)) {				
					
					// Holistic random configuration (holistic grid is not supported at this time)
	                int bestIteration = 0;
	                double bestFMeasure = 0;
	                for (int j = 0; j < NO_OF_TRIALS; j++) {
	                    int finalJ = j;
	                    
	                    // Set the next automatic random configuration
	                    WorkflowManager.iterateHolisticRandom(methodsConfig, null);
	
	                    // Run a workflow and check its F-measure    
	                    // Execute Workflow in different thread in order to be stoppable
	                    performances =  exec
	                    		.submit(() -> {return WorkflowManager.runWorkflow(false, interrupt_execution);})
	                    		.get();
	                   
	                    clp = performances.getValue0();
	        			if (clp == null || interrupt_execution.get()) return null;
	                    	                    
	                    // Keep this iteration if it has the best F-measure so far
	                    double fMeasure = clp.getFMeasure();
	                    if (bestFMeasure < fMeasure) {
	                        bestIteration = j;
	                        bestFMeasure = fMeasure;
	                    }
	                }
                    
	                System.out.println("Best Iteration\t:\t" + bestIteration);
	                System.out.println("Best FMeasure\t:\t" + bestFMeasure);
	
	                // Before running the workflow, we should configure the methods using the best iteration's parameters
	                WorkflowManager.iterateHolisticRandom(methodsConfig, bestIteration);
	
	                // Run the final workflow (whether there was an automatic configuration or not)
	                // Execute Workflow in different thread in order to be stoppable
	                performances =  exec
	                		.submit(() -> {return WorkflowManager.runWorkflow(true, interrupt_execution);})
	                		.get();
	                
	                double totalTime = (System.currentTimeMillis() - start_time)/ 1000;
	                clp = performances.getValue0();
	                blocksMethodsPerformances = performances.getValue1();
	    			
	                if (clp == null || interrupt_execution.get()) return null;
                    	   
	                // Store workflow results to H2 DB
	                dbm.storeWorkflowResults(WorkflowManager.workflowConfigurationsID, no_instances, totalTime, clp, blocksMethodsPerformances);
	    			
	                return new Triplet<ClustersPerformance , Double, Integer>(clp, totalTime, no_instances);
	               
				}
				else {
					
					 // Step-by-step automatic configuration. Set random or grid depending on the selected search type.
					// Execute Workflow in different thread in order to be stoppable
					performances =  exec
							.submit(() -> { return WorkflowManager.runStepByStepWorkflow(methodsConfig, 
									search_type.equals(JedaiOptions.AUTOCONFIG_RANDOMSEARCH), interrupt_execution);}
							)
							.get();
					double totalTime = System.currentTimeMillis() - start_time;
					clp = performances.getValue0();
					
					if (clp == null || interrupt_execution.get()) return null;
					
					// Store workflow results to H2 DB
					dbm.storeWorkflowResults(WorkflowManager.workflowConfigurationsID, no_instances, totalTime, clp, blocksMethodsPerformances);
					
					return new Triplet<ClustersPerformance , Double, Integer>(clp, totalTime, no_instances);
				}
				
			}
			// Run workflow without any automatic configuration
			// Execute Workflow in different thread in order to be stoppable
			performances =  exec
					.submit(() -> {return WorkflowManager.runWorkflow(true, interrupt_execution);})
					.get();
			double totalTime = (System.currentTimeMillis() - start_time)/1000;
			clp = performances.getValue0();
			blocksMethodsPerformances = performances.getValue1();
			
			if (clp == null || interrupt_execution.get()) return null;
			
			// Store workflow results to H2 DB
			dbm.storeWorkflowResults(WorkflowManager.workflowConfigurationsID, no_instances, totalTime, clp, blocksMethodsPerformances);
            
			return new Triplet<ClustersPerformance , Double, Integer>(clp, totalTime, no_instances);
		}
		catch(InterruptedException|ExecutionException e ) {
			e.printStackTrace();
			WorkflowManager.setErrorMessage(e.getMessage());
			return null;
		}
		catch(Exception e) {
			e.printStackTrace();
			WorkflowManager.setErrorMessage(e.getMessage());	
			return null;
		}
		
	}
    
}
