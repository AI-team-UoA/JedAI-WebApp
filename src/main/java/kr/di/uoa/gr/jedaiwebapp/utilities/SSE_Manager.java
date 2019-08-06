package kr.di.uoa.gr.jedaiwebapp.utilities;

import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import kr.di.uoa.gr.jedaiwebapp.utilities.events.EventMessage;


@Component
public  class SSE_Manager implements ApplicationListener<EventMessage>{
	private static SseEmitter emitter = null ;
	
	 
	public void setEmitter(SseEmitter emitter) { SSE_Manager.emitter = emitter;	}
	

	@Override
	public void onApplicationEvent(EventMessage event) {
		
	    System.out.println("EventListener: " + event.getMessage()  + " Emitter is Set: " + SSE_Manager.emitter != null);
	    try {
	    	
	    	SSE_Manager.emitter.send(event.getMessage());

	      }
	      catch (Exception e) {
	    	  e.printStackTrace();
	    	  
	      }
	}
	

}
