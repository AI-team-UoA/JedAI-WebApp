package kr.di.uoa.gr.jedaiwebapp.models;

import org.springframework.data.repository.CrudRepository;


public interface MethodConfigurationRepository extends CrudRepository<MethodConfiguration, Double>{
	
	MethodConfiguration findById(int id);

}
