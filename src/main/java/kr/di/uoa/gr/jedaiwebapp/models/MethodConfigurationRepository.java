package kr.di.uoa.gr.jedaiwebapp.models;

import org.springframework.data.repository.CrudRepository;


public interface MethodConfigurationRepository extends CrudRepository<MethodConfiguration, Integer>{
	
	MethodConfiguration findById(int id);

}
