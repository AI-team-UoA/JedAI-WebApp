package kr.di.uoa.gr.jedaiwebapp.models;

import java.util.List;

public class MethodModel {
	
	private String method_name;
	private String label;
	private String configuration_type;
	private List<ParametersModel> parameters;
	
	

	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public List<ParametersModel> getParameters() {
		return parameters;
	}
	public void setParameters(List<ParametersModel> parameters) {
		this.parameters = parameters;
	}
	public String getMethod() {
		return method_name;
	}
	public void setMethod(String method_name) {
		this.method_name = method_name;
	}
	public String getConf_type() {
		return configuration_type;
	}
	public void setConf_type(String configuration_type) {
		this.configuration_type = configuration_type;
	}
	
	
}
