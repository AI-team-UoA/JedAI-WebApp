package kr.di.uoa.gr.jedaiwebapp.controllers;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.di.uoa.gr.jedaiwebapp.models.requests.DataRead.ProfileReaderModel;

@RestController
@RequestMapping("/desktopmode/dataread")
public class ProfileReaderController {

	
	@PostMapping(
			consumes = { MediaType.APPLICATION_JSON_VALUE},
			produces = { MediaType.APPLICATION_JSON_VALUE})
	public String createProfileReader(@RequestBody ProfileReaderModel profile_reader) {
		System.out.println(profile_reader.getFiletype());
		return "ok";
	}
	
}
