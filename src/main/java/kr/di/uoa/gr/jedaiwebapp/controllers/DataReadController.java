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
import java.util.List;

import org.springframework.util.StringUtils;


@RestController
@RequestMapping("/desktopmode/dataread/**")
public class DataReadController {
	
	@Autowired
    private HttpServletRequest request;
	private DataReadModel dataRead;
	private int enities_per_page = 5;
	
	@PostMapping	
	public boolean DataRead(
			@RequestParam(value="file", required=false) MultipartFile file,
			@RequestParam MultiValueMap<String, String> configurations) {
		
		dataRead = null;
		String filetype = configurations.getFirst("filetype");
		String source = filetype.equals("Database") ? configurations.getFirst("url"): UploadFile(file);
		if (source == null || source.equals("")){
			return false;
		}
		else {
			dataRead = new DataReadModel(filetype, source, configurations);
			return true;
		}
	}
	
	@GetMapping("/desktopmode/dataread/explore")
	public int getPages() {
		List<EntityProfile> profiles = null;
		int pages = 0;
		
		if (dataRead != null) {	
			profiles = dataRead.read();
			pages = profiles.size()/enities_per_page;
		}
		return pages;
	}
	
	
	@GetMapping("/desktopmode/dataread/explore/{page}")
	public List<EntityProfile> explored(@PathVariable(value = "page") String page) {
		List<EntityProfile> profiles = null;
		
		if (dataRead != null) {
			int int_page = Integer.parseInt(page);
			profiles = dataRead.readSubset(int_page, int_page+enities_per_page);
		}
		return profiles;
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
