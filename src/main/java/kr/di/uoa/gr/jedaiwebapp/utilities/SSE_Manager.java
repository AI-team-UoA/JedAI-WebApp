package kr.di.uoa.gr.jedaiwebapp.utilities;

import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter.SseEventBuilder;

import kr.di.uoa.gr.jedaiwebapp.utilities.events.EventMessage;


@Component
public  class SSE_Manager implements ApplicationListener<EventMessage>{
	private static SseEmitter emitter = null ;
	
	 
	public void setEmitter(SseEmitter emitter) { SSE_Manager.emitter = emitter;	}
	

	@Override
	public void onApplicationEvent(EventMessage event) {
	    try {
	    	
	    	SseEventBuilder builder = SseEmitter.event().name(event.getEventName()).data(event.getMessage());
	    	SSE_Manager.emitter.send(builder);

	      }
	      catch (Exception e) {
	    	  e.printStackTrace();
	    	  
	      }
	}
	

}
