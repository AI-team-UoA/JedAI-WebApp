package kr.di.uoa.gr.jedaiwebapp.utilities;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

import org.scify.jedai.utilities.BlocksPerformance;
import org.scify.jedai.utilities.ClustersPerformance;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import kr.di.uoa.gr.jedaiwebapp.utilities.events.EventPublisher;

public class WorkflowDetailsManager {
	private static EventPublisher eventPublisher;
	String event_name="workflow_details";
	
	public WorkflowDetailsManager() {
		
		AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(WorkflowManager.class);
		eventPublisher = context.getBean(EventPublisher.class);
	}
	
	private void emit(String message) {eventPublisher.publish(message, this.event_name);	}
	
	
	public void print_Sentence(String entityProfile, int size) {
		String message = entityProfile + " :  " + size;
		this.emit(message);
	}
	
	
	
	public void print_BlockBuildingPerformance(BlocksPerformance blp, double totalTime, String methodConfiguration, String methodName) {
		
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		PrintStream ps = new PrintStream(baos);
		PrintStream old = System.out;
		System.setOut(ps);
		
		blp.printStatistics(totalTime, methodConfiguration, methodName);
		
		System.out.flush();
		System.setOut(old);
		
		String message = baos.toString();
		
		this.emit(message);
	}
	
	
	public void print_ClustersPerformance(ClustersPerformance clp, double totalTime, String methodConfiguration, String methodName) {
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		PrintStream ps = new PrintStream(baos);
		PrintStream old = System.out;
		System.setOut(ps);
		
		 clp.printStatistics(totalTime, methodName,methodConfiguration);
		
		System.out.flush();
		System.setOut(old);
		
		String message = baos.toString();
		
		this.emit(message);
		
	}
	
	
	
	

}
