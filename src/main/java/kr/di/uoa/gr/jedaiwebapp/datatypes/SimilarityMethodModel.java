package kr.di.uoa.gr.jedaiwebapp.datatypes;

import java.util.ArrayList;
import java.util.List;

import kr.di.uoa.gr.jedaiwebapp.models.SimilarityMethod;

public class SimilarityMethodModel {
    private String method_name;
    private String label;
    private List<Parameter> parameters;
    private String attribute1;
    private String attribute2;



    public SimilarityMethodModel() {}


    public SimilarityMethodModel(String method_name, String label, List<Parameter> parameters, String attribute1, String attribute2) {
        this.method_name = method_name;
        this.label = label;
        this.parameters = parameters;
        this.attribute1 = attribute1;
        this.attribute2 = attribute2;
    }
    
    public SimilarityMethodModel(SimilarityMethod sm) {
        this.method_name = null;
        this.label = sm.getLabel();
        this.attribute1 = sm.getAttribute1();
        this.attribute2 = sm.getAttribute2();
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


    public String getAttribute1() {
        return this.attribute1;
    }

    public void setAttribute1(String attribute1) {
        this.attribute1 = attribute1;
    }

    public String getAttribute2() {
        return this.attribute2;
    }

    public void setAttribute2(String attribute2) {
        this.attribute2 = attribute2;
    }


}