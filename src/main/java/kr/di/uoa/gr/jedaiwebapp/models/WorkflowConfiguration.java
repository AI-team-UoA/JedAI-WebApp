package kr.di.uoa.gr.jedaiwebapp.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="WorkflowConfiguration")
public class WorkflowConfiguration {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(updatable = false, nullable = false, unique = true)
	private int id;
	
	private String erMode;
	private int datasetID1;
	private int datasetID2;
	private int gtID;
	private int schemaClustering;
	private int[] blockBuilding;
	private int[] blockCleaning;
	private int comparisonCleaning;
	private int entityMatching;
	private int entityClustering;
	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getErMode() {
		return erMode;
	}
	public void setErMode(String erMode) {
		this.erMode = erMode;
	}
	public int getDatasetID1() {
		return datasetID1;
	}
	public void setDatasetID1(int datasetID1) {
		this.datasetID1 = datasetID1;
	}
	public int getDatasetID2() {
		return datasetID2;
	}
	public void setDatasetID2(int datasetID2) {
		this.datasetID2 = datasetID2;
	}
	public int getGtID() {
		return gtID;
	}
	public void setGtID(int gtID) {
		this.gtID = gtID;
	}
	public int getSchemaClustering() {
		return schemaClustering;
	}
	public void setSchemaClustering(int schemaClustering) {
		this.schemaClustering = schemaClustering;
	}
	public int[] getBlockBuilding() {
		return blockBuilding;
	}
	public void setBlockBuilding(int[] blockBuilding) {
		this.blockBuilding = blockBuilding;
	}
	public int[] getBlockCleaning() {
		return blockCleaning;
	}
	public void setBlockCleaning(int[] blockCleaning) {
		this.blockCleaning = blockCleaning;
	}
	public int getComparisonCleaning() {
		return comparisonCleaning;
	}
	public void setComparisonCleaning(int comparisonCleaning) {
		this.comparisonCleaning = comparisonCleaning;
	}
	public int getEntityMatching() {
		return entityMatching;
	}
	public void setEntityMatching(int entityMatching) {
		this.entityMatching = entityMatching;
	}
	public int getEntityClustering() {
		return entityClustering;
	}
	public void setEntityClustering(int entityClustering) {
		this.entityClustering = entityClustering;
	}
	
	
	

}
