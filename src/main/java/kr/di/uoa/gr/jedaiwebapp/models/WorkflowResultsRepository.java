package kr.di.uoa.gr.jedaiwebapp.models;

import org.springframework.data.repository.CrudRepository;

public interface WorkflowResultsRepository extends CrudRepository<WorkflowResults, Integer>{

	WorkflowResults findById(int id);

}
