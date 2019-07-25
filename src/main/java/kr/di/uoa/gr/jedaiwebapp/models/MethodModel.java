package kr.di.uoa.gr.jedaiwebapp.models;

import java.util.List;

public class RadioMethodModel {
	
	private String method;
	private String label;
	private String conf_type;
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
		return method;
	}
	public void setMethod(String method) {
		this.method = method;
	}
	public String getConf_type() {
		return conf_type;
	}
	public void setConf_type(String conf_type) {
		this.conf_type = conf_type;
	}
	
	
}
