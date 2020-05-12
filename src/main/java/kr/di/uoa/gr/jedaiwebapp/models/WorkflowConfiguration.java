package kr.di.uoa.gr.jedaiwebapp.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="workflow_configuration")
public class WorkflowConfiguration {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(updatable = false, nullable = false, unique = true, name="id")
	private int id;
	
	@Column(name="er_mode")
	private String erMode;

	@Column(name="wf_mode")
	private String wfMode;
	
	@Column(name="datasetid1")
	private int datasetID1;
	
	@Column(name="datasetid2")
	private int datasetID2;
	
	@Column(name="gtid")
	private int gtID;
	
	@Column(name="schema_clustering")
	private int schemaClustering;
	
	@Column(name="block_building")
	private int[] blockBuilding;
	
	@Column(name="block_cleaning")
	private int[] blockCleaning;
	
	@Column(name="comparison_cleaning")
	private int comparisonCleaning;
	
	@Column(name="entity_matching")
	private int entityMatching;
	
	@Column(name="entity_clustering")
	private int entityClustering;

	@Column(name="similarity_join")
	private int similarityJoin;
	
	public WorkflowConfiguration(){}
	
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

	public String getWfMode() {
		return this.wfMode;
	}

	public void setWfMode(String wfMode) {
		this.wfMode = wfMode;
	}

	public int getSimilarityJoin() {
		return this.similarityJoin;
	}

	public void setSimilarityJoin(int similarityJoin) {
		this.similarityJoin = similarityJoin;
	}
	

}
