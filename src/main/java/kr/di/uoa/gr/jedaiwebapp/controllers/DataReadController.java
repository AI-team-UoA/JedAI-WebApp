package kr.di.uoa.gr.jedaiwebapp.controllers;

import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.javatuples.Pair;
import org.scify.jedai.datamodel.EntityProfile;
import org.scify.jedai.datamodel.EquivalenceCluster;
import org.springframework.beans.factory.annotation.Autowired;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;

import gnu.trove.iterator.TIntIterator;
import kr.di.uoa.gr.jedaiwebapp.models.DataReadModel;
import kr.di.uoa.gr.jedaiwebapp.models.EntityProfileNode;
import kr.di.uoa.gr.jedaiwebapp.utilities.JedaiOptions;
import kr.di.uoa.gr.jedaiwebapp.utilities.WorkflowManager;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.util.StringUtils;


@RestController
@RequestMapping("/desktopmode/dataread/**")
public class DataReadController {
	
	@Autowired
    private HttpServletRequest request;
	private Map<String, DataReadModel> dataRead_map;
	private List<EntityProfileNode> entityProfiles_1;
	private List<EntityProfileNode> entityProfiles_2;
	private List<Pair<EntityProfileNode,EntityProfileNode>> duplicates;
	
	private int enities_per_page = 5;
	
	
	/**
	 * Constructor
	 * 
	 * */
	DataReadController(){
		entityProfiles_1 = new ArrayList<>();
		entityProfiles_2 = new ArrayList<>();
		dataRead_map = new HashMap<String, DataReadModel>();
	}
	
	
	
	/**
	 * Set the dataset of the workflow and initialize the list which will be displayed in explore.
	 * The input file will be uploaded and stored in the server.
	 * 
	 * @file the selected file
	 * @configurations informations regarding the input dataset
	 * @return the path in the server of the uploaded file
	 * */
	@PostMapping	
	public String DataRead(
			@RequestParam(value="file", required=false) MultipartFile file,
			@RequestParam MultiValueMap<String, Object> configurations) {
		
		
		String filetype = (String) configurations.getFirst("filetype");
		String source =  filetype.equals("Database") ? (String) configurations.getFirst("url"): UploadFile(file);
		if (source == null || source.equals("")){
			return "";
		}
		else {
			String entity_id = (String) configurations.getFirst("entity_id");
			if (dataRead_map.containsKey(entity_id))
				dataRead_map.remove(entity_id);
			try {
				DataReadModel entity_profile = new DataReadModel(filetype, source, configurations);
				dataRead_map.put(entity_id, entity_profile);
				
				switch(entity_id) {
				case "1":
					WorkflowManager.profilesD1 = entity_profile.read();
					
					//construct the dataset which will be displayed in explore
					for (int i=0; i<WorkflowManager.profilesD1.size(); i++) {
						EntityProfile entity = WorkflowManager.profilesD1.get(i);
						EntityProfileNode entity_node = new EntityProfileNode(entity, i+1);
						entityProfiles_1.add(entity_node);	
					}	
					break;
					
				case "2":	
					WorkflowManager.profilesD2 = entity_profile.read();
					
					//construct the dataset which will be displayed in explore
					for (int i=0; i<WorkflowManager.profilesD2.size(); i++) {
						EntityProfile entity = WorkflowManager.profilesD2.get(i);
						EntityProfileNode entity_node = new EntityProfileNode(entity, i+1);
						entityProfiles_2.add(entity_node);	
					}
					break;
					
				case "3":
					WorkflowManager.ground_truth = entity_profile.read_GroundTruth(WorkflowManager.er_mode,
								WorkflowManager.profilesD1,
								WorkflowManager.profilesD2);
					 
				    //construct the dataset which will be displayed in explore
					this.duplicates = entity_profile.getDuplicates_GroundTruth();
					break;
				}
				return source;
			}
			catch(Exception e) {
				e.printStackTrace();
				return "";
			}
		}
	}
	
	
	
	
	/**
	 * Calculate the number of pages
	 * 
	 *  @entity_id the id of the examined entityProfile
	 *  @return the maximum number of pages
	 */
	@GetMapping("/desktopmode/dataread/{entity_id}/explore")
	public int getMaxPages(@PathVariable(value = "entity_id") String entity_id) {
		
		switch(entity_id) {
			case "1":
				return this.entityProfiles_1.size()/enities_per_page;
			case "2":
				return this.entityProfiles_2.size()/enities_per_page;
			case "3":
				return this.duplicates.size()/enities_per_page;
			default:
				return 0;
		}
	}
	
	
	/**
	 * Calculate and return the entities which will be displayed in the
	 * requested page
	 * 
	 * @page the examined page
	 * @return the entities which will be displayed
	 **/
	@GetMapping("/desktopmode/dataread/{entity_id}/explore/{page}")
	public List<?> explored(@PathVariable(value = "page") String page,
			@PathVariable(value = "entity_id") String entity_id) {
		int int_page = Integer.parseInt(page);
		
		int start = (int_page - 1) * enities_per_page;
		int end = start + enities_per_page;
		
		switch(entity_id) {
			case "1":
				return this.entityProfiles_1.subList(start, end);
				
			case "2":
				return this.entityProfiles_2.subList(start, end);
			
			case "3":
				return this.duplicates.subList(start, end);
				
			default:
				return null;
		}
	}
			
		
	/**
	 * Upload the input file in the server
	 * @file the input file
	 * @return the path
	 **/
	public String UploadFile(MultipartFile file) {
		String uploadsDir = "/uploads/";
        String realPathtoUploads =  request.getServletContext().getRealPath(uploadsDir);
       
        if(! new File(realPathtoUploads).exists())
        {
            new File(realPathtoUploads).mkdir();
            
        }
               
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String filepath = realPathtoUploads + fileName;
        File dest = new File(filepath);
        if(! dest.exists()) {
	        try {
				file.transferTo(dest);
				System.out.println("File was stored Successfully in "+ filepath);
			} catch (IllegalStateException | IOException e) {
				e.printStackTrace();
			}
        }
        else {
        	System.out.println("File already exist in "+ filepath);
        }
        
        return filepath;
	}
	
}
