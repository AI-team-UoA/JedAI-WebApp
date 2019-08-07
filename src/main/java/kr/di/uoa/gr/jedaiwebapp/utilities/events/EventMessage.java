package kr.di.uoa.gr.jedaiwebapp.utilities.events;

import org.springframework.context.ApplicationEvent;

public class EventMessage  extends ApplicationEvent{
	
	private String message;
	private String event_name;
	
	public EventMessage(Object source, String message, String name) {
        super(source);
        this.message = message;
        this.event_name = name;
    }
	
	
    public String getMessage() {
        return message;
    }
    
    public String getEventName() {
        return event_name;
    }

}
