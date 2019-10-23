package kr.di.uoa.gr.jedaiwebapp.models;


import org.springframework.data.repository.CrudRepository;

public interface WorkflowConfigurationRepository extends CrudRepository<WorkflowConfiguration, Double>{
	
	WorkflowConfiguration findById(int id);

}
