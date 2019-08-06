package kr.di.uoa.gr.jedaiwebapp.utilities.events;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class EventPublisher {
	
	@Autowired
    private ApplicationEventPublisher applicationEventPublisher;
	
	

    public void publish(final String message) {
    	
        System.out.println("Publishing custom event. MSG: " + message);
        
        EventMessage event = new EventMessage(this, message);
        applicationEventPublisher.publishEvent(event);
    }

}
