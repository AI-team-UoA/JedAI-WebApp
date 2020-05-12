
package kr.di.uoa.gr.jedaiwebapp.models;

import org.springframework.data.repository.CrudRepository;


public interface SimilarityJoinRepository extends CrudRepository<SimilarityMethodModel, Integer>{
	
	MethodConfiguration findById(int id);

}
