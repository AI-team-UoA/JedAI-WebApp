package kr.di.uoa.gr.jedaiwebapp.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.json.JSONObject;
import org.scify.jedai.datamodel.Attribute;

import org.springframework.web.multipart.MultipartFile;
import kr.di.uoa.gr.jedaiwebapp.datatypes.EntityProfileNode;
import kr.di.uoa.gr.jedaiwebapp.utilities.WorkflowManager;
import kr.di.uoa.gr.jedaiwebapp.utilities.StaticReader;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.JedaiOptions;

import javax.servlet.http.HttpServletRequest;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;


@RestController
@RequestMapping("/desktopmode/dataread/**")
public class DataReadController {
	
	private int entities_per_page = 5;
	
	@Autowired
    private HttpServletRequest request;
	
	
	/**
	 * Set the dataset of the workflow and initialize the list which will be displayed in explore.
	 * The input file will be uploaded and stored in the server.
	 * 
	 * @param file the selected file
	 * @param configurations informations regarding the input dataset
	 * @return the path in the server of the uploaded file
	 * */
	@PostMapping(path = "/desktopmode/dataread/setConfigurationWithFile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)	
	public String setDatasetWithFile(
			@RequestPart(value="file") MultipartFile file,
			@RequestPart(required=true) String json_conf){
				
		JSONObject configurations = new JSONObject(json_conf);
		String filetype = configurations.getString("filetype");
		String source = null;
		if (filetype.equals("Database") )
			source = configurations.getString("url");
		else if (file != null)
			source = UploadFile(file);
		
		String filename = StringUtils.cleanPath(file.getOriginalFilename());
		
		StaticReader.realPathToUploads =  request.getServletContext().getRealPath("/uploads/");
		return StaticReader.setDataset(configurations, source, filename);
	}


	@PostMapping(path = "/desktopmode/dataread/setConfiguration")	
	public String SetDataset(@RequestPart(required=true) String json_conf){
		
		JSONObject configurations = new JSONObject(json_conf);
		String filetype = configurations.getString("filetype");
		String source = null;
		if (filetype.equals("Database") )
			source = configurations.getString("url");
		else
			source = configurations.getString("filename");

		if (! isURL(source) && !filetype.equals("Database"))
			return "";
		
		String filename = configurations.getString("filename");
		
		StaticReader.realPathToUploads =  request.getServletContext().getRealPath("/uploads/");
		return StaticReader.setDataset(configurations, source, filename);
	}

	
	
	/**
	 * Calculate the number of pages
	 * 
	 *  @param entity_id the id of the examined entityProfile
	 *  @return the maximum number of pages
	 */
	@GetMapping("/desktopmode/dataread/{entity_id}/explore")
	public int getMaxPages(@PathVariable(value = "entity_id") String entity_id) {
		
		switch(entity_id) {
			case "1":
				if (StaticReader.entityProfiles1 == null) 
					return 0;
				else
					return StaticReader.entityProfiles1.size()/entities_per_page;
			case "2":
				if (StaticReader.entityProfiles2 == null) 
					return 0;
				else
					return StaticReader.entityProfiles2.size()/entities_per_page;
			case "3":
				if (StaticReader.duplicates == null) 
					return 0;
				else
					return StaticReader.duplicates.size()/entities_per_page;
			default:
				return 0;
		}
	}

	public static boolean isURL(String url) 
    { 
        /* checking if it is a URL */
        try { 
            new URL(url).toURI(); 
            return true; 
        } 
        catch (Exception e) { 
            return false; 
        } 
	} 
	
	
	/**
	 * Calculate and return the entities which will be displayed in the
	 * requested page
	 * 
	 * @param page the examined page
	 * @return the entities which will be displayed
	 **/
	@GetMapping("/desktopmode/dataread/{entity_id}/explore/{page}")
	public List<?> explored(@PathVariable(value = "page") String page,
			@PathVariable(value = "entity_id") String entity_id) {
		int int_page = Integer.parseInt(page);
		
		int start = (int_page - 1) * entities_per_page;
		int end = start + entities_per_page;
		
		switch(entity_id) {
			case "1":
				if (StaticReader.entityProfiles1 == null) 
					return null;
				else{
					int max = StaticReader.entityProfiles1.size();
					if (max < end) end = max;
					return StaticReader.entityProfiles1.subList(start, end);
				}
			case "2":
				if (StaticReader.entityProfiles2 == null)
					return null;
				else{
					int max = StaticReader.entityProfiles2.size();
					if (max < end) end = max;
					return StaticReader.entityProfiles2.subList(start, end);
				}
			case "3":
				if (StaticReader.duplicates == null) 
					return null;
				else{
					int max = StaticReader.duplicates.size();
					if (max < end) end = max;
					return StaticReader.duplicates.subList(start, end);
				}				
			default:
				return null;
		}
	}
			
	
	@GetMapping("/desktopmode/dataread/headers")
	public List<Set<String>> getHeaders() {
		List<Set<String>> headers = new ArrayList<>();
		Set<String> headers1 = new HashSet<String>();
		for (EntityProfileNode en : StaticReader.entityProfiles1)
			for (Attribute attr : en.getProfile().getAttributes())
				headers1.add(attr.getName());
		headers.add(headers1);

		if(WorkflowManager.er_mode.equals(JedaiOptions.CLEAN_CLEAN_ER)){
			Set<String> headers2 = new HashSet<String>();
			for (EntityProfileNode en : StaticReader.entityProfiles2)
				for (Attribute attr : en.getProfile().getAttributes())
					headers2.add(attr.getName());
			headers.add(headers2);
		}
		return headers;
	}



	/**
	 * Upload the input file in the server
	 * @param file the input file
	 * @return the path
	 **/
	public String UploadFile(MultipartFile file) {

        String realPathToUploads =  request.getServletContext().getRealPath("/uploads/");
       
        if(! new File(realPathToUploads).exists())
            new File(realPathToUploads).mkdir();
        String filename = StringUtils.cleanPath(file.getOriginalFilename());
        String filepath = realPathToUploads + filename;
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
