package kr.di.uoa.gr.jedaiwebapp.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name="method_configuration")
public class MethodConfiguration {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(updatable = false, nullable = false, unique = true, name="id")
	private int id;
	
	@Column(name="method")
	private String method;

	@Column(name="label")
	private String label;

	@Column(name="configuration_type")
	private String configurationType;
	
	@Transient
	private String[] parametersAr;

	@Column(name="parameters")
	private String parameters;
	
	
	public String[] getParametersAr() {
		return parametersAr;
	}
	public void setParametersAr(String[] parametersAr) {
		this.parametersAr = parametersAr;
	}
	
	public int getId() {
		return id;
	}
	public String getMethod() {
		return method;
	}
	public void setMethod(String method) {
		this.method = method;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public String getConfigurationType() {
		return configurationType;
	}
	public void setConfigurationType(String configurationType) {
		this.configurationType = configurationType;
	}
	public String getParameters() {
		return parameters;
	}
	public void setParameters(String parameters) {
		this.parameters = parameters;
	}
	
	

}
