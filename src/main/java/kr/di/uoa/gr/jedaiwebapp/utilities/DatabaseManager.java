package kr.di.uoa.gr.jedaiwebapp.utilities;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.javatuples.Triplet;
import org.scify.jedai.utilities.BlocksPerformance;
import org.scify.jedai.utilities.ClustersPerformance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import kr.di.uoa.gr.jedaiwebapp.datatypes.MethodModel;
import kr.di.uoa.gr.jedaiwebapp.models.Dataset;
import kr.di.uoa.gr.jedaiwebapp.models.DatasetRepository;
import kr.di.uoa.gr.jedaiwebapp.models.MethodConfiguration;
import kr.di.uoa.gr.jedaiwebapp.models.MethodConfigurationRepository;
import kr.di.uoa.gr.jedaiwebapp.models.WorkflowConfiguration;
import kr.di.uoa.gr.jedaiwebapp.models.WorkflowConfigurationRepository;
import kr.di.uoa.gr.jedaiwebapp.models.WorkflowResults;
import kr.di.uoa.gr.jedaiwebapp.models.WorkflowResultsRepository;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.JedaiOptions;

@Component
public class DatabaseManager {
	
	@Autowired
	private WorkflowResultsRepository workflowResultsRepository;
	
	@Autowired
	private WorkflowConfigurationRepository workflowConfigurationRepository;
	
	@Autowired
	private DatasetRepository datasetRepository;
	
	@Autowired
	private MethodConfigurationRepository methodConfigurationRepository;
	
	
	public WorkflowConfiguration findWCByID(int wfID) {return workflowConfigurationRepository.findById(wfID);}
	
	public Dataset findDatasetByID(int dID) { return datasetRepository.findById(dID);}
	
	public MethodConfiguration findMCbyID(int mID) { return methodConfigurationRepository.findById(mID);}
	
	public List<MethodConfiguration> findAllMCbyIDs(List<Integer> mIDs) { return (List<MethodConfiguration>) methodConfigurationRepository.findAllById(mIDs);}
	
	public WorkflowResults findWRByID(int wrID) {return workflowResultsRepository.findById(wrID);}

	public Iterable<WorkflowResults> findAllWR() {return workflowResultsRepository.findAll();}
	
	public WorkflowResults findWRByWCID(int wfID) {return workflowResultsRepository.findByworkflowID(wfID);}
	
	public boolean existsWC(int wfID) {return workflowConfigurationRepository.existsById(wfID);}
	
	public boolean existsWRByWCID(int wfID) {return workflowResultsRepository.existsByworkflowID(wfID);}
	
	public void storeOrUpdateWR(WorkflowResults workflowResults) {workflowResultsRepository.save(workflowResults);}
	
	public void storeOrUpdateWC(WorkflowConfiguration workflowConfiguration) {workflowConfigurationRepository.save(workflowConfiguration);}
	
	public void storeOrUpdateMC(MethodConfiguration m) {methodConfigurationRepository.save(m);}
	
	public void storeOrUpdateDataset(Dataset dt) {datasetRepository.save(dt);}
	
	public void deleteWR(WorkflowResults wr) {workflowResultsRepository.delete(wr);}
	
	public void deleteWCByID(int wfID) {workflowConfigurationRepository.deleteById(wfID);}
	
	
	/**
	 * 
	 * @param wfID workflow ID
	 * @return a map containing the configurations of a requested workflow
	 */
	public Map<String, Object> getWorkflowConfigurations(int wfID) {
		
		if (wfID == -1) return null;
		Map<String, Object> configurations = new HashMap<>();
		WorkflowConfiguration wc = findWCByID(wfID);
		
		configurations.put("id", wfID);
		
		String erMode = wc.getErMode();
		configurations.put("mode", erMode);
		
		int datasetID1 = wc.getDatasetID1();
		Dataset d1 = findDatasetByID(datasetID1);
		configurations.put("d1", d1);			
		
		if (erMode.equals(JedaiOptions.CLEAN_CLEAN_ER)){
			int datasetID2 = wc.getDatasetID2();
			Dataset d2 = findDatasetByID(datasetID2);
			configurations.put("d2", d2);			
		}
			
		int gtID = wc.getGtID();
		Dataset gt= findDatasetByID(gtID);
		configurations.put("gt", gt);
		
		int scID = wc.getSchemaClustering();
		MethodConfiguration sc = findMCbyID(scID);
		configurations.put(JedaiOptions.SCHEMA_CLUSTERING, new MethodModel(sc));
		
					
		List<Integer> bbIDs =  Arrays.stream(wc.getBlockBuilding()).boxed().collect(Collectors.toList());
		Iterable<MethodConfiguration> bb = findAllMCbyIDs(bbIDs);
		List<MethodModel> bbmm = new ArrayList<>();
		for (MethodConfiguration mc : bb) 
			bbmm.add(new MethodModel(mc));
		configurations.put(JedaiOptions.BLOCK_BUILDING, bbmm);
		
		try {
			List<Integer> bcIDs =  Arrays.stream(wc.getBlockCleaning()).boxed().collect(Collectors.toList());
			Iterable<MethodConfiguration> bc = findAllMCbyIDs(bcIDs);
			List<MethodModel> bcmm = new ArrayList<>();
			for (MethodConfiguration mc : bc) 
				bcmm.add(new MethodModel(mc));
			configurations.put(JedaiOptions.BLOCK_CLEANING, bcmm);
		}
		catch(Exception ignore) {}
		
		int ccID = wc.getComparisonCleaning();
		MethodConfiguration cc = findMCbyID(ccID);
		configurations.put(JedaiOptions.COMPARISON_CLEANING, new MethodModel(cc));
		
		int emID = wc.getEntityMatching();
		MethodConfiguration em = findMCbyID(emID);
		configurations.put(JedaiOptions.ENTITY_MATCHING, new MethodModel(em));
		
		int ecID = wc.getEntityClustering();
		MethodConfiguration ec = findMCbyID(ecID);
		configurations.put(JedaiOptions.ENTITY_CLUSTERING, new MethodModel(ec));
		
		
		return configurations;
	}
	
	/**
	 * Store the results of an executed workflow into the DB
	 * 
	 * @param no_instances input instances
	 * @param totalTime total execution time
	 * @param clp total workflow performance
	 * @param performances the performances of each method
	 */
	public void storeWorkflowResults(int wfID, int no_instances, double totalTime, ClustersPerformance clp, 
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
		
		WorkflowResults workflowResults;
		if (existsWRByWCID(wfID)){
			workflowResults = findWRByWCID(wfID);
			workflowResults.update(wfID, no_instances, clp.getEntityClusters(), time, methodNames, recall,
					precision, fmeasure, clp.getExistingDuplicates(), clp.getDetectedDuplicates(), clp.getTotalMatches());
		}
		else
			workflowResults = new WorkflowResults(wfID, no_instances, clp.getEntityClusters(), time, methodNames, recall,
					precision, fmeasure, clp.getExistingDuplicates(), clp.getDetectedDuplicates(), clp.getTotalMatches());
		
		
		storeOrUpdateWR(workflowResults);	
	}
	

	
}
