package kr.di.uoa.gr.jedaiwebapp.datatypes;

import java.util.ArrayList;
import java.util.List;

import kr.di.uoa.gr.jedaiwebapp.models.MethodConfiguration;

public class MethodModel {
	
	private String method_name;
	private String label;
	private String configuration_type;
	private List<Parameter> parameters;
	
	
	public MethodModel() {}
	
	public MethodModel(MethodConfiguration mc) {
		this.method_name = mc.getMethod();
		this.label = mc.getLabel();
		this.configuration_type = mc.getConfigurationType();
		List<String> parameters = mc.getParameters();
		this.parameters = new ArrayList<>();
		for (String p : parameters) 
			this.parameters.add(new Parameter(p));
		
		System.out.println(this.parameters);
	}
	

	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public List<Parameter> getParameters() {
		return parameters;
	}
	public void setParameters(List<Parameter> parameters) {
		this.parameters = parameters;
	}
	public String getMethod_name() {
		return method_name;
	}
	public void setMethod_name(String method_name) {
		this.method_name = method_name;
	}
	public String getConfiguration_type() {
		return configuration_type;
	}
	public void setConfiguration_type(String configuration_type) {
		this.configuration_type = configuration_type;
	}
	
	
}
