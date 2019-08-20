package kr.di.uoa.gr.jedaiwebapp.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class HomeController {
	
	@GetMapping(value={"/clustermode", "/desktopmode", "/workflow", "/error"})	
	public String renderHome() {
		return "index";
		
	}

}
