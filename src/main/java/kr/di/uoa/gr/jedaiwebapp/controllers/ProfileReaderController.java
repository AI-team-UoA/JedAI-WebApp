package kr.di.uoa.gr.jedaiwebapp.controllers;

import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/desktopmode/dataread")
public class ProfileReaderController {

	
	@PostMapping	
	public String createProfileReader(
			@RequestParam(value="file", required=false) MultipartFile file,
			@RequestParam MultiValueMap<String, String> map) {
		
		System.out.println("RECEIVED");
		System.out.println(file);
		System.out.println(map);
		
		return "ok";
	}
	
	/*@PostMapping
	public String createProfileReader( @RequestParam("file") MultipartFile file,
			@RequestParam("configuration") String conf,
			ProfileReaderModel profileReader
				) {		
		System.out.println("RECEIVED");
		System.out.println(file);
		System.out.println(conf);
		System.out.println(profileReader.getFiletype());
		
		return "ok";
	}*/
	

	
}
