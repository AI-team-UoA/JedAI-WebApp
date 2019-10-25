package kr.di.uoa.gr.jedaiwebapp.models;

import org.springframework.data.repository.CrudRepository;

public interface DatasetRepository extends CrudRepository<Dataset, Integer>{
		
	Dataset findById(int id);

}
