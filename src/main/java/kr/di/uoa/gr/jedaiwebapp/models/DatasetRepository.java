package kr.di.uoa.gr.jedaiwebapp.models;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class DatasetRepository {

	@Autowired
	JdbcTemplate jdbcTemplate;
	 
	
	public Dataset findById(int id) {
	    return jdbcTemplate.queryForObject("select * from Dataset where id=?", new Object[] {
	            id
	        },
	        new BeanPropertyRowMapper <Dataset> (Dataset.class));
	}
	
	public int deleteById(int id) {
	    return jdbcTemplate.update("delete from Dataset where id=?", new Object[] {
	        id
	    });
	}
	
	public int insert(Dataset dataset) {
		
	    return jdbcTemplate.update("insert into DATASET (id, type, source, filetype, entity_id, separator, first_row, excluded_attr,"
	    		+ " id_index, TABLE_NAME, DB_USERNAME, DB_PASSWORD, ssl) " + "values(?, ?, ?, ? , ? , ? , ? , ? , ? , ? , ? , ? , ?)",
	        new Object[] {
	        		dataset.getId(), dataset.getType(), dataset.getSource(), dataset.getFiletype(), dataset.getEntity_id(), dataset.getSeparator(),
	        		dataset.getFirst_row(), dataset.getExcluded_attr(), dataset.getId_index(), dataset.getTableName(), dataset.getDbUsername(),
	        		dataset.getDbPassword(), dataset.isSsl()
	        });
	}
	
	public int update(Dataset dataset) {
	    return jdbcTemplate.update("update DATASET set " 
	    		+ " id = ?, type = ?, source = ?, filetype = ?, entity_id = ?, separator = ?, first_row = ?, excluded_attr = ?,"  
	    		+ " id_index = ?, TABLE_NAME = ?, DB_USERNAME = ?, DB_PASSWORD = ?, ssl = ?",
	        new Object[] {
	        		dataset.getId(), dataset.getType(), dataset.getSource(), dataset.getFiletype(), dataset.getEntity_id(), dataset.getSeparator(),
	        		dataset.getFirst_row(), dataset.getExcluded_attr(), dataset.getId_index(), dataset.getTableName(), dataset.getDbUsername(),
	        		dataset.getDbPassword(), dataset.isSsl()
	        });
	}
}
