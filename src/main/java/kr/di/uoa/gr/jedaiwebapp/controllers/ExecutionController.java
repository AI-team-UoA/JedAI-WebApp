package kr.di.uoa.gr.jedaiwebapp.controllers;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

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
import kr.di.uoa.gr.jedaiwebapp.models.Dataset;
import kr.di.uoa.gr.jedaiwebapp.models.DatasetRepository;
import kr.di.uoa.gr.jedaiwebapp.models.MethodConfiguration;
import kr.di.uoa.gr.jedaiwebapp.models.MethodConfigurationRepository;
import kr.di.uoa.gr.jedaiwebapp.models.WorkflowConfiguration;
import kr.di.uoa.gr.jedaiwebapp.models.WorkflowConfigurationRepository;
import kr.di.uoa.gr.jedaiwebapp.models.WorkflowResults;
import kr.di.uoa.gr.jedaiwebapp.models.WorkflowResultsRepository;
import kr.di.uoa.gr.jedaiwebapp.utilities.SSE_Manager;
import kr.di.uoa.gr.jedaiwebapp.utilities.WorkflowManager;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.JedaiOptions;

@RestController
@RequestMapping("/workflow/**")
public class ExecutionController {
	
	@Autowired
	private final static int NO_OF_TRIALS = 100;
	private ExecutorService exec ;
	private static AtomicBoolean iterrupt_execution;
	private Map<String, Object> methodsConfig;
	private SSE_Manager sse_manager;
	private List<Pair<EntityProfileNode, EntityProfileNode>> detected_duplicates;
	private int enities_per_page = 5;
	
	@Autowired
	private WorkflowResultsRepository workflowResultsRepository;
	
	@Autowired
	private WorkflowConfigurationRepository workflowConfigurationRepository;
	
	@Autowired
	private DatasetRepository datasetRepository;
	
	@Autowired
	private MethodConfigurationRepository methodConfigurationRepository;
	
	ExecutionController(){
		exec = Executors.newSingleThreadExecutor();
		iterrupt_execution = new AtomicBoolean(false);
		sse_manager = new SSE_Manager();
		methodsConfig = getWotkflowConfigurations(WorkflowManager.workflowConfigurationsID);
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
	
	@GetMapping("/workflow/id")
	public int getWorkflowID() {return WorkflowManager.workflowConfigurationsID;}
	
	
	public void storeWorkflowResults(int no_instances, double totalTime, ClustersPerformance clp, 
			List<Triplet<String, BlocksPerformance, Double>> performances) {
		
		double[] time = new double[performances.size()+1];
		double[] recall = new double[performances.size()+1];
		double[] precision = new double[performances.size()+1];
		double[] fmeasure = new double[performances.size()+1];
		List<String> methodNames = new ArrayList<String>();
		
		time[0] = totalTime;
		recall[0] = clp.getRecall();
		precision[0] = clp.getPrecision();
		fmeasure[0] = clp.getFMeasure();		
		methodNames.add("Total");
		
		int i = 1;
		for (Triplet<String, BlocksPerformance, Double> t: performances) {
			BlocksPerformance performance = t.getValue1();
			methodNames.add(t.getValue0());
			time[i] = t.getValue2();
			recall[i] = performance.getPc();
			precision[i] = performance.getPq();
			fmeasure[i] = performance.getFMeasure();
			i++;			
		}
		
		WorkflowResults workflowResults = new WorkflowResults( WorkflowManager.workflowConfigurationsID,
				no_instances, clp.getEntityClusters(), time, methodNames, recall, precision, fmeasure);
		workflowResultsRepository.save(workflowResults);
	 
		
	}
	
	@GetMapping("/workflow/workbench/delete/{id}")
	public boolean deleteWotkflow(@PathVariable(value = "id") int wrofkfowResultID) {
		try {
			WorkflowResults wr = workflowResultsRepository.findById(wrofkfowResultID);
			int wfID = wr.getWorkflowID();
			workflowResultsRepository.delete(wr);
			workflowConfigurationRepository.deleteById(wfID);
			return true;
		}
		catch (Exception e) { 
			e.printStackTrace();
			return false;
		}
	}
	
	
	@GetMapping("/workflow/workbench/get_configurations/{id}")
	public Map<String, Object> getWotkflowConfigurationsFromResultsID(@PathVariable(value = "id") int wrofkfowResultID) {
	
		WorkflowResults wr = workflowResultsRepository.findById(wrofkfowResultID);
		int wfID = wr.getWorkflowID();
		return getWotkflowConfigurations(wfID);		
	}
	
		
	public Map<String, Object> getWotkflowConfigurations(@PathVariable(value = "id") int wfID) {
		try{
			if (wfID == -1) return null;
			
			Map<String, Object> configurations = new HashMap<>();
			WorkflowConfiguration wc = workflowConfigurationRepository.findById(wfID);
				
			String erMode = wc.getErMode();
			configurations.put("mode", erMode);
			
			int datasetID1 = wc.getDatasetID1();
			Dataset d1 = datasetRepository.findById(datasetID1);
			configurations.put("d1", d1);			
			
			if (erMode.equals(JedaiOptions.CLEAN_CLEAN_ER)){
				int datasetID2 = wc.getDatasetID2();
				Dataset d2 = datasetRepository.findById(datasetID2);
				configurations.put("d2", d2);			
			}
				
			int gtID = wc.getGtID();
			Dataset gt= datasetRepository.findById(gtID);
			configurations.put("gt", gt);
			
			int scID = wc.getSchemaClustering();
			MethodConfiguration sc = methodConfigurationRepository.findById(scID);
			configurations.put(JedaiOptions.SCHEMA_CLUSTERING, new MethodModel(sc));
			
						
			List<Integer> bbIDs =  Arrays.stream(wc.getBlockBuilding()).boxed().collect(Collectors.toList());
			Iterable<MethodConfiguration> bb = methodConfigurationRepository.findAllById(bbIDs);
			List<MethodModel> bbmm = new ArrayList<>();
			for (MethodConfiguration mc : bb) 
				bbmm.add(new MethodModel(mc));
			configurations.put(JedaiOptions.BLOCK_BUILDING, bbmm);
			
			List<Integer> bcIDs =  Arrays.stream(wc.getBlockCleaning()).boxed().collect(Collectors.toList());
			Iterable<MethodConfiguration> bc = methodConfigurationRepository.findAllById(bcIDs);
			List<MethodModel> bcmm = new ArrayList<>();
			for (MethodConfiguration mc : bc) 
				bcmm.add(new MethodModel(mc));
			configurations.put(JedaiOptions.BLOCK_CLEANING, bcmm);
			
			int ccID = wc.getComparisonCleaning();
			MethodConfiguration cc = methodConfigurationRepository.findById(ccID);
			configurations.put(JedaiOptions.COMPARISON_CLEANING, new MethodModel(cc));
			
			int emID = wc.getEntityMatching();
			MethodConfiguration em = methodConfigurationRepository.findById(emID);
			configurations.put(JedaiOptions.ENTITY_MATHCING, new MethodModel(em));
			
			int ecID = wc.getEntityClustering();
			MethodConfiguration ec = methodConfigurationRepository.findById(ecID);
			configurations.put(JedaiOptions.ENTITY_CLUSTERING, new MethodModel(ec));
			
			
			return configurations;
		}
		catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	
	@GetMapping("/workflow/workbench/")
	public Iterable<WorkflowResults> getWotkflows() {
		
		Iterable<WorkflowResults> wfrI = workflowResultsRepository.findAll();
		return wfrI	;
	}
	
    
	/**
     * Set the detected duplicate dataset
     * 
     * @return the number o pages
     */
	@GetMapping("/workflow/{id}/explore")
	public int setExplore(){
		detected_duplicates = WorkflowManager.getDetectedDuplicates();
		return detected_duplicates.size()/enities_per_page;
	}
	
	
	
	/**
     * Calculate and return the instances for the requested page.
     * The instances will be displayed in the Explore window
     * 
     * @return the instances for the requested page.
     */
	@GetMapping("/workflow/{id}/explore/{page}")
	public List<Pair<EntityProfileNode, EntityProfileNode>> getExploreSubset(@PathVariable(value = "page") String page){
		if (detected_duplicates == null) return null;
		int int_page = Integer.parseInt(page);
		int start = (int_page - 1) * enities_per_page;
		int end = start + enities_per_page;
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
	public boolean congurationsSetCorrectly() {
		if (WorkflowManager.er_mode == null) return false;
		if (WorkflowManager.er_mode.equals(JedaiOptions.DIRTY_ER)) {
			return WorkflowManager.profilesD1 != null 
					&& WorkflowManager.ground_truth != null
					&& WorkflowManager.block_building != null && WorkflowManager.block_building.size() > 0
					&& WorkflowManager.entity_matching != null
					&& WorkflowManager.entity_clustering != null;
		}
		else {
			return WorkflowManager.profilesD1 != null 
					&& WorkflowManager.profilesD2 != null 
					&& WorkflowManager.ground_truth != null
					&& WorkflowManager.block_building != null && WorkflowManager.block_building.size() > 0
					&& WorkflowManager.entity_matching != null
					&& WorkflowManager.entity_clustering != null;
		}
	}
	
	/**
	 *  
	 * kill the thread that executes the workflow
	 * */	
	@GetMapping("/workflow/stop/")
	public void stopExecution() { iterrupt_execution.set(true);	}
			
		
	/**
	 *  
	 * @return true if any configurations has been set to automatic
	 * */	
	@GetMapping("/workflow/automatic_conf/")
	public boolean getAutomaticIsSet() { return anyAutomaticConfig(); }
		
	
	
	/**
	 * Check if any automatic configuration has been set
	 * 
	 * @return true if any configurations has been set to automatic
	 * */
	public boolean anyAutomaticConfig() {
		
		boolean automatic_conf = false;
		
		if (this.methodsConfig == null)
			this.methodsConfig = getWotkflowConfigurations(WorkflowManager.workflowConfigurationsID);
		
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
	public Triplet<ClustersPerformance , Double, Integer> executeWorkflow(
			@PathVariable(value = "automatic_type") String automatic_type,
			@PathVariable(value = "search_type") String search_type) {
		try {
			
			if (!congurationsSetCorrectly()) {
				WorkflowManager.setErrorMessage("The configurations have not been set correctly!");
				return null;
			}			
			
			iterrupt_execution.set(false);
			
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
	                    iterateHolisticRandom(null);
	
	                    // Run a workflow and check its F-measure    
	                    // Execute Workflow in different thread in order to be stoppable
	                    performances =  exec
	                    		.submit(() -> {return WorkflowManager.runWorkflow(false, iterrupt_execution);})
	                    		.get();
	                   
	                    clp = performances.getValue0();
	        			if (clp == null || iterrupt_execution.get()) return null;
	                    	                    
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
	                iterateHolisticRandom(bestIteration);
	
	                // Run the final workflow (whether there was an automatic configuration or not)
	                // Execute Workflow in different thread in order to be stoppable
	                performances =  exec
	                		.submit(() -> {return WorkflowManager.runWorkflow(true, iterrupt_execution);})
	                		.get();
	                
	                double totalTime = System.currentTimeMillis() - start_time;
	                clp = performances.getValue0();
	                blocksMethodsPerformances = performances.getValue1();
	    			
	                if (clp == null || iterrupt_execution.get()) return null;
                    	   
	                // Store workflow results to H2 DB
	    			storeWorkflowResults(no_instances, totalTime, clp, blocksMethodsPerformances);
	    			
	                return new Triplet<ClustersPerformance , Double, Integer>(clp, totalTime, no_instances);
	               
				}
				else {
					
					 // Step-by-step automatic configuration. Set random or grid depending on the selected search type.
					// Execute Workflow in different thread in order to be stoppable
					performances =  exec
							.submit(() -> { return WorkflowManager.runStepByStepWorkflow(methodsConfig, 
									search_type.equals(JedaiOptions.AUTOCONFIG_RANDOMSEARCH), iterrupt_execution);}
							)
							.get();
					double totalTime = System.currentTimeMillis() - start_time;
					clp = performances.getValue0();
					
					if (clp == null || iterrupt_execution.get()) return null;
					
					// Store workflow results to H2 DB
					storeWorkflowResults(no_instances, totalTime, clp, blocksMethodsPerformances);
					
					return new Triplet<ClustersPerformance , Double, Integer>(clp, totalTime, no_instances);
				}
				
			}
			// Run workflow without any automatic configuration
			// Execute Workflow in different thread in order to be stoppable
			performances =  exec
					.submit(() -> {return WorkflowManager.runWorkflow(true, iterrupt_execution);})
					.get();
			double totalTime = System.currentTimeMillis() - start_time;
			clp = performances.getValue0();
			blocksMethodsPerformances = performances.getValue1();
			
			if (clp == null || iterrupt_execution.get()) return null;
			
			// Store workflow results to H2 DB
			storeWorkflowResults(no_instances, totalTime, clp, blocksMethodsPerformances);
            
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
	
	
	/**
     * When bestIteration is null, set the next random configuration for each method in the workflow that should be
     * automatically configured. If it is set, set these methods to that configuration.
     *
     * @param bestIteration Best iteration (optional)
     */
    private void iterateHolisticRandom(Integer bestIteration) {
        
    	//Check if schema clustering parameters should be set automatically
    	if(WorkflowManager.schema_clustering != null)
	        if (bestIteration == null) 
	        	WorkflowManager.schema_clustering.setNextRandomConfiguration();
	        else 
	        	WorkflowManager.schema_clustering.setNumberedRandomConfiguration(bestIteration);
        

        // Check if any block building method parameters should be set automatically
        if (WorkflowManager.getBlock_building() != null && !WorkflowManager.getBlock_building().isEmpty()) {
            // Index of the methods in the Block Building List
            int enabledMethodIndex = 0;

            // Check each block building method configuration
            List<MethodModel> blockBuilding_methods = (List<MethodModel>) methodsConfig.get(JedaiOptions.BLOCK_BUILDING);
            for (MethodModel method : blockBuilding_methods){
                // Method is enabled, check if we should configure automatically
                if (method.getConfiguration_type().equals(JedaiOptions.AUTOMATIC_CONFIG)) {
                    // Get instance of the method and set next random configuration
                    if (bestIteration == null) 
                    	WorkflowManager.block_building.get(enabledMethodIndex).setNextRandomConfiguration();
                    else 
                    	WorkflowManager.block_building.get(enabledMethodIndex).setNumberedRandomConfiguration(bestIteration);
                    
                    // Increment index
                    enabledMethodIndex++;
                }
            }            
        }

        
        // Check if any block cleaning method parameters should be set automatically
        if (WorkflowManager.getBlock_cleaning() != null && !WorkflowManager.getBlock_cleaning().isEmpty()) {
            // Index of the methods in the Block Cleaning Methods List
            int enabledMethodIndex = 0;

            // Check each block cleaning method configuration
            List<MethodModel> blockCleaning_methods = (List<MethodModel>) methodsConfig.get(JedaiOptions.BLOCK_CLEANING);
            for ( MethodModel method :blockCleaning_methods) {
                
                // Method is enabled, check if we should configure automatically
                if (method.getConfiguration_type().equals(JedaiOptions.AUTOMATIC_CONFIG)) {
                    // Get instance of the method and set next random configuration
                    if (bestIteration == null) 
                    	WorkflowManager.block_cleaning.get(enabledMethodIndex).setNextRandomConfiguration();
                    else
                    	WorkflowManager.block_cleaning.get(enabledMethodIndex).setNumberedRandomConfiguration(bestIteration);
                    
                    // Increment index
                    enabledMethodIndex++;
                }
            }
        }
       

        // Check if comparison cleaning parameters should be set automatically
        if(WorkflowManager.comparison_cleaning != null)
	        if (((MethodModel) methodsConfig.get(JedaiOptions.COMPARISON_CLEANING)).getConfiguration_type().equals(JedaiOptions.AUTOMATIC_CONFIG)) 
	            if (bestIteration == null) 
	            	WorkflowManager.comparison_cleaning.setNextRandomConfiguration();
	            else 
	            	WorkflowManager.comparison_cleaning.setNumberedRandomConfiguration(bestIteration);
            

        // Check if entity matching parameters should be set automatically
        if (((MethodModel) methodsConfig.get(JedaiOptions.ENTITY_MATHCING)).getConfiguration_type().equals(JedaiOptions.AUTOMATIC_CONFIG)) {
            if (bestIteration == null) 
            	WorkflowManager.entity_matching.setNextRandomConfiguration();
            else 
            	WorkflowManager.entity_matching.setNumberedRandomConfiguration(bestIteration);
        }

        
        // Check if entity clustering parameters should be set automatically
        if (((MethodModel) methodsConfig.get(JedaiOptions.ENTITY_CLUSTERING)).getConfiguration_type().equals(JedaiOptions.AUTOMATIC_CONFIG)) {
            if (bestIteration == null) 
            	WorkflowManager.entity_clustering.setNextRandomConfiguration();
            else 
            	WorkflowManager.entity_clustering.setNumberedRandomConfiguration(bestIteration);
        }
    }

    
}
