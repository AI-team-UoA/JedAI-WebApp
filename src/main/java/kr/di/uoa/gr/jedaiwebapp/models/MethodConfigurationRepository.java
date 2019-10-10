package kr.di.uoa.gr.jedaiwebapp.models;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class MethodConfigurationRepository {

	@Autowired
	JdbcTemplate jdbcTemplate;
	
	 
	
	public MethodConfiguration findById(int id) {
	    return jdbcTemplate.queryForObject("select * from method_configuration where id=?", new Object[] {id},
	        new BeanPropertyRowMapper <MethodConfiguration> (MethodConfiguration.class));
	}
	
	public int deleteById(int id) {
	    return jdbcTemplate.update("delete from method_configuration where id=?", new Object[] { id });
	}
	
	public int insert(MethodConfiguration methodConf) {
		
	    return jdbcTemplate.update("insert into method_configuration (id, method, label, CONFIGURATION_TYPE, parameters) values(?, ?, ?, ?, ?)",
	        new Object[] {methodConf.getId(), methodConf.getMethod(), methodConf.getLabel(), methodConf.getConfigurationType(), methodConf.getParameters()});
	}
	
	public int update(MethodConfiguration methodConf) {
	    return jdbcTemplate.update("update method_configuration set id = ?, method = ?, label = ?, CONFIGURATION_TYPE = ?, parameters = ?",
	        new Object[] {methodConf.getId(), methodConf.getMethod(), methodConf.getLabel(), methodConf.getConfigurationType(), methodConf.getParameters()});
	}
}
