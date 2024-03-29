package kr.di.uoa.gr.jedaiwebapp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.di.uoa.gr.jedaiwebapp.models.WorkflowResults;
import kr.di.uoa.gr.jedaiwebapp.utilities.DatabaseManager;


@RestController
@RequestMapping("/workflow/workbench/**")
public class WorkbenchController {
	
	@Autowired
	private DatabaseManager dbm;


	@GetMapping("/workflow/workbench/delete/{id}")
	public boolean deleteWorkflowResult(@PathVariable(value = "id") int workflowResultID) {
		try {
			WorkflowResults wr = dbm.findWRByID(workflowResultID);
			int wfID = wr.getWorkflowID();
			dbm.deleteWR(wr);
			dbm.deleteWCByID(wfID);
			
			return true;
		}
		catch (Exception e) { 
			e.printStackTrace();
			return false;
		}
	}
		
	
	@GetMapping("/workflow/workbench/")
	public Iterable<WorkflowResults> getWotkflows() {return dbm.findAllWR();}

}
