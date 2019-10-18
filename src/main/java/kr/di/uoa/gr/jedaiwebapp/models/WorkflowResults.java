package kr.di.uoa.gr.jedaiwebapp.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="WorkflowResults")
public class WorkflowResults {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(updatable = false, nullable = false, unique = true)
	private int id;
	
	private int workflowID;
	private int inputInstances;
	private int clusters;
	private double time;
	private String methodNames;
	private String[] methodNamesAr;
	private double[] recall;
	private double[] precision;
	private double[] fmeasure;
	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getWorkflowID() {
		return workflowID;
	}
	public void setWorkflowID(int workflowID) {
		this.workflowID = workflowID;
	}
	public int getInputInstances() {
		return inputInstances;
	}
	public void setInputInstances(int inputInstances) {
		this.inputInstances = inputInstances;
	}
	public int getClusters() {
		return clusters;
	}
	public void setClusters(int clusters) {
		this.clusters = clusters;
	}
	public double getTime() {
		return time;
	}
	public void setTime(double time) {
		this.time = time;
	}
	public String getMethodNames() {
		return methodNames;
	}
	public void setMethodNames(String methodNames) {
		this.methodNames = methodNames;
	}
	public String[] getMethodNamesAr() {
		return methodNamesAr;
	}
	public void setMethodNamesAr(String[] methodNamesAr) {
		this.methodNamesAr = methodNamesAr;
	}
	public double[] getRecall() {
		return recall;
	}
	public void setRecall(double[] recall) {
		this.recall = recall;
	}
	public double[] getPrecision() {
		return precision;
	}
	public void setPrecision(double[] precision) {
		this.precision = precision;
	}
	public double[] getFmeasure() {
		return fmeasure;
	}
	public void setFmeasure(double[] fmeasure) {
		this.fmeasure = fmeasure;
	}
	
}
