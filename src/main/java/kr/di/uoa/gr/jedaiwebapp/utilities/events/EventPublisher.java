package kr.di.uoa.gr.jedaiwebapp.utilities.events;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;


/**
 * Publish an event. The event will be received by the SSE Manager
 * which is the listener
 * */

@Component
public class EventPublisher {
	
	@Autowired
    private ApplicationEventPublisher applicationEventPublisher;
	
	
	/**
	 * Publish an event. 
	 * @param message 
	 * @param name the name of the SSE 
	 * */
    public void publish(final String message, String name) {
    	
        System.out.println("Publishing custom event. MSG: " + message);
        
        EventMessage event = new EventMessage(this, message, name);
        applicationEventPublisher.publishEvent(event);
    }

}
