package kr.di.uoa.gr.jedaiwebapp.sparkExecution;

import SparkER.LivyJob;
import org.apache.livy.LivyClient;
import org.apache.livy.LivyClientBuilder;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


import java.net.URI;

@RestController
@RequestMapping("/spark/**")
public class SparkController {

    @GetMapping("/spark/run")
	public void run() {
        try {
            URI livyUrl = new URI("http://195.134.71.15:8998");
            URI SparkERJar = new URI("file:///usr/local/livy/apache-livy-0.7.0-incubating-bin/jars/spark_er-assembly-1.0.jar");
            LivyClient client = new LivyClientBuilder()
                    .setURI(livyUrl)
                    .build();

            client.addJar(SparkERJar).get();
            Object results = client.submit(new LivyJob(200)).get();
            System.out.println(results.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }


    }
}