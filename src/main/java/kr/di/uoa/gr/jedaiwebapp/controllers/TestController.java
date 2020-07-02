package kr.di.uoa.gr.jedaiwebapp.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/test/**")
public class TestController {
    
    @GetMapping("/test/get/{er_mode}/{wf_mode}/{dt_choice}")
    public String getTest(
                @PathVariable(value = "er_mode") String er_mode,
                @PathVariable(value = "wf_mode") String wf_mode,
                @PathVariable(value = "dt_choice") String dt_choice){
                    
        System.out.println(er_mode + " " + wf_mode + " " + dt_choice);
        try{
            Path path = Paths.get("data/CleanClean_ER/ABT-Buy/bb_workflow_conf.json");
            String json_conf = String.join("\n", Files.readAllLines(path));

            return json_conf; 
        }
        catch(IOException| SecurityException e){
            return null;
        }
    }
}