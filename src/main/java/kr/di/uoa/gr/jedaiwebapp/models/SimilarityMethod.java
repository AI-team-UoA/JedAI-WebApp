package kr.di.uoa.gr.jedaiwebapp.models;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="similarity_join_methods")
public class SimilarityMethod {

    @Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(updatable = false, nullable = false, unique = true, name="id")
	private int id;

	@Column(name="label")
	private String label;

	@Column(name="attribute1")
    private String attribute1;
    
	@Column(name="attribute2")
	private String attribute2;
	
	@ElementCollection
	@Column(name="parameters")
    private List<String> parameters;
    

    public SimilarityMethod() {}

    public SimilarityMethod(int id, String label, String attribute1, String attribute2, List<String> parameters) {
        this.id = id;
        this.label = label;
        this.attribute1 = attribute1;
        this.attribute2 = attribute2;
        this.parameters = parameters;
    }

    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLabel() {
        return this.label;
    }

    public void setLabel(String label) {
        this.label = label;
    }


    public List<String> getParameters() {
        return this.parameters;
    }

    public void setParameters(List<String> parameters) {
        this.parameters = parameters;
    }

    public SimilarityMethod id(int id) {
        this.id = id;
        return this;
    }

    public SimilarityMethod label(String label) {
        this.label = label;
        return this;
    }


    public SimilarityMethod parameters(List<String> parameters) {
        this.parameters = parameters;
        return this;
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