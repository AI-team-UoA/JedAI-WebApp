package kr.di.uoa.gr.jedaiwebapp.models;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class WorkflowConfigurationRepository {

	@Autowired
	JdbcTemplate jdbcTemplate;
	
	 
	
	public WorkflowConfiguration findById(int id) {
	    return jdbcTemplate.queryForObject("select * from workflow_configuration where id=?", new Object[] {id},
	        new BeanPropertyRowMapper <WorkflowConfiguration> (WorkflowConfiguration.class));
	}
	
	public int deleteById(int id) {
	    return jdbcTemplate.update("delete from workflow_configuration where id=?", new Object[] { id });
	}
	
	public int insert(WorkflowConfiguration wfConf) {
		
	    return jdbcTemplate.update("insert into workflow_configuration (id, block_building, block_cleaning, comparison_cleaning, datasetid1, datasetid2,"
	    		+ "entity_clustering, entity_matching, er_mode, gtid, schema_clustering) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )",
	        new Object[] {wfConf.getId(), wfConf.getBlockBuilding(), wfConf.getBlockCleaning(), wfConf.getComparisonCleaning(), wfConf.getDatasetID1(), 
	        		wfConf.getDatasetID2(), wfConf.getEntityClustering(), wfConf.getEntityMatching(), wfConf.getErMode(), wfConf.getGtID(), wfConf.getSchemaClustering()});
	}
	
	public int update(WorkflowConfiguration wfConf) {
	    return jdbcTemplate.update("update workflow_configuration set "
	    		+ "id = ?, "
	    		+ "block_building = ?, "
	    		+ "block_cleaning = ?, "
	    		+ "comparison_cleaning = ?, "
	    		+ "datasetid1 = ?, "
	    		+ "datasetid2 = ?, "
	    		+ "entity_clustering = ?, "
	    		+ "entity_matching = ?, "
	    		+ "er_mode = ?, "
	    		+ "gtid = ?, "
	    		+ "schema_clustering = ? ",
	        new Object[] {wfConf.getId(), wfConf.getBlockBuilding(), wfConf.getBlockCleaning(), wfConf.getComparisonCleaning(), wfConf.getDatasetID1(), 
	        		wfConf.getDatasetID2(), wfConf.getEntityClustering(), wfConf.getEntityMatching(), wfConf.getErMode(), wfConf.getGtID(), wfConf.getSchemaClustering()});
	}
}
