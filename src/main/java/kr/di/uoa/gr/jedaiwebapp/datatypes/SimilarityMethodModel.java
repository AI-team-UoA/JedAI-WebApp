package kr.di.uoa.gr.jedaiwebapp.datatypes;

import java.util.List;

public class SimilarityMethodModel {
    private String name;
    private String label;
    private List<Parameter> parameters;
    private String attribute;


    public SimilarityMethodModel() {}

    public SimilarityMethodModel(SimilarityMethodModel sm) {
        this.name = sm.getName();
        this.label = sm.getLabel();
        this.attribute = sm.getAttribute();
		this.parameters = sm.getParameters();
	}


    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
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