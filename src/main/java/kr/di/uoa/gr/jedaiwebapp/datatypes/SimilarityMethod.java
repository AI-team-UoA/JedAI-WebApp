package kr.di.uoa.gr.jedaiwebapp.datatypes;

import java.util.List;

public class SimilarityMethod {
    private String method_name;
    private String label;
    private List<Parameter> parameters;
    private String attribute;


    public SimilarityMethod() {}

    public SimilarityMethod(SimilarityMethod sm) {
        this.method_name = sm.getMethod_name();
        this.label = sm.getLabel();
        this.attribute = sm.getAttribute();
		this.parameters = sm.getParameters();
	}


    public String getMethod_name() {
        return this.method_name;
    }

    public void setMethod_name(String name) {
        this.method_name = name;
    }

    public String getLabel() {
        return this.label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public List<Parameter> getParameters() {
        return this.parameters;
    }

    public void setParameters(List<Parameter> parameters) {
        this.parameters = parameters;
    }

    public String getAttribute() {
        return this.attribute;
    }

    public void setAttribute(String attribute) {
        this.attribute = attribute;
    }

    
    
}