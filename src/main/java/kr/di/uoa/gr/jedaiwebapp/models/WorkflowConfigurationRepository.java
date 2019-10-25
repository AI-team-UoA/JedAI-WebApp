package kr.di.uoa.gr.jedaiwebapp.models;


import org.springframework.data.repository.CrudRepository;

public interface WorkflowConfigurationRepository extends CrudRepository<WorkflowConfiguration, Integer>{
	
	WorkflowConfiguration findById(int id);

}
