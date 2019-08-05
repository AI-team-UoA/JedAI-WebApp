package kr.di.uoa.gr.jedaiwebapp.controllers;

import org.springframework.web.bind.annotation.RequestMapping;

public class HomeController {

	@RequestMapping(value = "/")
	public String index() {
		System.out.println("home");
		return "index";
	}

}
