package kr.di.uoa.gr.jedaiwebapp.controllers;

import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.scify.jedai.datamodel.EntityProfile;
import org.springframework.beans.factory.annotation.Autowired;
import javax.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;

import kr.di.uoa.gr.jedaiwebapp.models.DataReadModel;

import java.io.File;
import java.io.IOException;
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
	private int enities_per_page = 5;
	
	DataReadController(){
		dataRead_map = new HashMap<String, DataReadModel>();
	}
	
	@PostMapping	
	public String DataRead(
			@RequestParam(value="file", required=false) MultipartFile file,
			@RequestParam MultiValueMap<String, String> configurations) {
		
		
		String filetype = configurations.getFirst("filetype");
		String source = filetype.equals("Database") ? configurations.getFirst("url"): UploadFile(file);
		if (source == null || source.equals("")){
			return "";
		}
		else {
			String entity_id = configurations.getFirst("entity_id");
			if (dataRead_map.containsKey(entity_id))
				dataRead_map.remove(entity_id);
			try {
				dataRead_map.put(entity_id,new DataReadModel(filetype, source, configurations));
				return source;
			}
			catch(Exception e) {
				return "";
			}
		}
	}
	
	@GetMapping("/desktopmode/dataread/{entity_id}/explore")
	public int getMaxPages(@PathVariable(value = "entity_id") String entity_id) {
		if (dataRead_map.containsKey(entity_id) ) 	
			return dataRead_map.get(entity_id).getProfilesSize() /enities_per_page;
		else	
			return 0;
	}
	
	
	@GetMapping("/desktopmode/dataread/{entity_id}/explore/{page}")
	public List<EntityProfile> explored(@PathVariable(value = "page") String page,
			@PathVariable(value = "entity_id") String entity_id) {
		List<EntityProfile> profiles = null;
		try {
			if (dataRead_map.containsKey(entity_id)) {
				int int_page = Integer.parseInt(page);
				profiles = dataRead_map.get(entity_id).readSubset(int_page, int_page+enities_per_page);
			}
			return profiles;
		}
		catch (java.lang.NumberFormatException e) {
			return profiles;
		}
	}
	

	
	
	
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
