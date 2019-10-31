package kr.di.uoa.gr.jedaiwebapp.models;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface WorkflowResultsRepository extends CrudRepository<WorkflowResults, Integer>{

	WorkflowResults findById(int id);
	
	WorkflowResults findByworkflowID(int workflowID);

}
