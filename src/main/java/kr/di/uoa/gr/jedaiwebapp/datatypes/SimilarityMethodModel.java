package kr.di.uoa.gr.jedaiwebapp.datatypes;

import java.util.ArrayList;
import java.util.List;

import kr.di.uoa.gr.jedaiwebapp.models.SimilarityMethod;

public class SimilarityMethodModel {
    private String method_name;
    private String label;
    private List<Parameter> parameters;
    private String attribute;


    public SimilarityMethodModel() {}

    public SimilarityMethodModel(SimilarityMethodModel sm) {
        this.method_name = sm.getMethod_name();
        this.label = sm.getLabel();
        this.attribute = sm.getAttribute();
		this.parameters = sm.getParameters();
    }
    
    public SimilarityMethodModel(SimilarityMethod sm) {
        this.method_name = null;
        this.label = sm.getLabel();
        this.attribute = sm.getAttribute();
        this.parameters = new ArrayList<>();
		for (String p : sm.getParameters()) 
			this.parameters.add(new Parameter(p));
		
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