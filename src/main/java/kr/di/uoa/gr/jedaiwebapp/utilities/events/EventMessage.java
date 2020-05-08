package kr.di.uoa.gr.jedaiwebapp.utilities.events;

import org.springframework.context.ApplicationEvent;


/**
 * The event object used in communications among Spring Components
 * Mostly used in order to send messages to the SSE Manager
 * */
public class EventMessage  extends ApplicationEvent{
	
	/**
     *
     */
    private static final long serialVersionUID = 1L;
    private String message;
	private String event_name;
	
	
	/**
	 * Constructor
	 * 
	 */
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
