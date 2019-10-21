package kr.di.uoa.gr.jedaiwebapp.models;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class WorkflowResultsRepository {

	@Autowired
	JdbcTemplate jdbcTemplate;
	
	public WorkflowResults findById(int id) {
	    return jdbcTemplate.queryForObject("select * from workflow_results where id=?", new Object[] {id},
	        new BeanPropertyRowMapper <WorkflowResults> (WorkflowResults.class));
	}
	
	public int deleteById(int id) {
	    return jdbcTemplate.update("delete from workflow_results where id=?", new Object[] { id });
	}
	
	public int insert(WorkflowResults wRes) {
		
	    return jdbcTemplate.update("insert into workflow_results (id, clusters, fmeasure, input_instances, method_names, "
	    		+ " precision, recall, time, workflowid) values(?, ?, ?, ?, ?, ?, ?, ?, ?)",
	        new Object[] {wRes.getId(), wRes.getClusters(), wRes.getFmeasure(), wRes.getInputInstances(), wRes.getMethodNames(), 
	        		wRes.getPrecision(), wRes.getRecall(), wRes.getTime(), wRes.getWorkflowID()});
	}
	
	public int update(WorkflowResults wRes) {
	    return jdbcTemplate.update("update workflow_results set "
	    		+ "id = ?, "
	    		+ "clusters = ?, "
	    		+ "fmeasure = ?, "
	    		+ "input_instances = ?, "
	    		+ "method_names = ?, "
	    		+ "precision = ?, "
	    		+ "recall = ?, "
	    		+ "time = ?, "
	    		+ "workflowid = ? ",
	        new Object[] {wRes.getId(), wRes.getClusters(), wRes.getFmeasure(), wRes.getInputInstances(), wRes.getMethodNames(), 
	        		wRes.getPrecision(), wRes.getRecall(), wRes.getTime(), wRes.getWorkflowID()});
	}
	
	
}
