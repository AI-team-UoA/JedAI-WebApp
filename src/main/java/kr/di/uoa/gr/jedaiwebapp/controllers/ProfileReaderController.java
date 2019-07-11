package kr.di.uoa.gr.jedaiwebapp.controllers;

import javax.validation.Valid;

import org.springframework.http.MediaType;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.di.uoa.gr.jedaiwebapp.models.requests.DataRead.ProfileReaderModel;

@RestController
@RequestMapping("/desktopmode/dataread")
public class ProfileReaderController {

	
	@PostMapping
	public String createProfileReader(@RequestPart("properties")  @Valid ProfileReaderModel profile_reader,
			@RequestPart("file") MultipartFile file) {
		System.out.println("RECEIVED");
		System.out.println(profile_reader.getFiletype()+ " " + profile_reader.getConfiguration().getFilename());
		return "ok";
	}
	

	
}
