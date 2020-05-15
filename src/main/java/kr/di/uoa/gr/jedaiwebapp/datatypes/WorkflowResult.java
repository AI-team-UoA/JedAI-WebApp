package kr.di.uoa.gr.jedaiwebapp.datatypes;


public class WorkflowResult {
    

    private String resultName;
    private double recall;
    private double precision;
    private double f1Measure;
    private double totalTime;
    private int inputInstances;
    private int numOfClusters;
    private int detailsId;

    public WorkflowResult(String resultName, double recall, double precision, double f1Measure, double totalTime,
                          int inputInstances, int numOfClusters, int detailsId) {
        this.resultName = new String(resultName);
        this.recall = recall;
        this.precision = precision;
        this.f1Measure = f1Measure;
        this.totalTime = totalTime;
        this.inputInstances = inputInstances;
        this.numOfClusters = numOfClusters;
        this.detailsId = detailsId;
    }


    // Automatically generated getters below

    public String getResultName() {
        return resultName;
    }

    public String resultNameProperty() {
        return resultName;
    }

    public double getRecall() {
        return recall;
    }

    public double recallProperty() {
        return recall;
    }

    public double getPrecision() {
        return precision;
    }

    public double precisionProperty() {
        return precision;
    }

    public double getF1Measure() {
        return f1Measure;
    }

    public double f1MeasureProperty() {
        return f1Measure;
    }

    public double getTotalTime() {
        return totalTime;
    }

    public double totalTimeProperty() {
        return totalTime;
    }

    public int getInputInstances() {
        return inputInstances;
    }

    public int inputInstancesProperty() {
        return inputInstances;
    }

    public int getNumOfClusters() {
        return numOfClusters;
    }

    public int numOfClustersProperty() {
        return numOfClusters;
    }

    public int getDetailsId() {
        return detailsId;
    }

    public int detailsIdProperty() {
        return detailsId;
    }

}