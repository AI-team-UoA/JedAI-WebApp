package kr.di.uoa.gr.jedaiwebapp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.di.uoa.gr.jedaiwebapp.models.WorkflowConfigurationRepository;
import kr.di.uoa.gr.jedaiwebapp.models.WorkflowResults;
import kr.di.uoa.gr.jedaiwebapp.models.WorkflowResultsRepository;


@RestController
@RequestMapping("/workflow/workbench/**")
public class WorkbenchController {
	
	@Autowired
	private WorkflowResultsRepository workflowResultsRepository;
	
	@Autowired
	private WorkflowConfigurationRepository workflowConfigurationRepository;
		
	
	@GetMapping("/workflow/workbench/delete/{id}")
	public boolean deleteWotkflowResult(@PathVariable(value = "id") int wrofkfowResultID) {
		try {
			WorkflowResults wr = workflowResultsRepository.findById(wrofkfowResultID);
			int wfID = wr.getWorkflowID();
			workflowResultsRepository.delete(wr);
			workflowConfigurationRepository.deleteById(wfID);
			return true;
		}
		catch (Exception e) { 
			e.printStackTrace();
			return false;
		}
	}
		
	
	@GetMapping("/workflow/workbench/")
	public Iterable<WorkflowResults> getWotkflows() {
		
		Iterable<WorkflowResults> wfrI = workflowResultsRepository.findAll();
		return wfrI	;
	}

}
