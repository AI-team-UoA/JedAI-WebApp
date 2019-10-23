package kr.di.uoa.gr.jedaiwebapp.models;

import org.springframework.data.repository.CrudRepository;

public interface DatasetRepository extends CrudRepository<Dataset, Double>{
		
	Dataset findById(int id);

}
