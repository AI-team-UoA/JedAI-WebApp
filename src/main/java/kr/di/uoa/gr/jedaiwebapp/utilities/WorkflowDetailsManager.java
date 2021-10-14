package kr.di.uoa.gr.jedaiwebapp.utilities;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

import kr.di.uoa.gr.jedaiwebapp.execution.WorkflowManager;
import org.scify.jedai.utilities.BlocksPerformance;
import org.scify.jedai.utilities.ClustersPerformance;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import kr.di.uoa.gr.jedaiwebapp.utilities.events.EventPublisher;


/**
 * Send messages containing the Performance of the workflow steps
 * The messages will be displayed in the details tab of the front-end
 * */
public class WorkflowDetailsManager {
	private static EventPublisher eventPublisher;
	String event_name="workflow_details";
	
	
	/**
	 * Constructor
	 * */
	public WorkflowDetailsManager() {
		
		AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(WorkflowManager.class);
		eventPublisher = context.getBean(EventPublisher.class);
	}
	
	
	/**
	 * Publish the event via the publisher
	 * @param message 
	 * */
	private void emit(String message) {eventPublisher.publish(message, this.event_name);	}
	
	
	/**
	 * Create a message 
	 * @param text the message
	 * @param value the corresponding value
	 * */
	public void print_Sentence(String text, int value) {
		String message = text + " :  " + value;
		this.emit(message);
	}
	
	
	/**
	 * Create a message 
	 * @param text the message
	 * @param value the corresponding value
	 * */
	public void print_Sentence(String text, double value) {
		String message = text + " :  " + value;
		this.emit(message);
	}
	
	
	/**
	 * Create a message 
	 * @param message the message
	 * */
	public void print_Sentence(String message) { this.emit(message);}
	
	
	/**
	 * Create a message containing the performance of the block building process
	 * @param blp the block building performance object
	 * @param totalTime duration time
	 * @param methodConfiguration the method's configurations
	 * @param methodName the method's name
	 * */
	public void print_BlockBuildingPerformance(BlocksPerformance blp, float totalTime, String methodConfiguration, String methodName) {
		
		
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
	
	
	/**
	 * Create a message containing the performance of the clusters
	 * @param clp the clusters performace object
	 * @param totalTime duration time
	 * @param methodConfiguration the method's configurations
	 * @param methodName the method's name
	 * */
	public void print_ClustersPerformance(ClustersPerformance clp, float totalTime, String methodConfiguration, String methodName) {
		
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
