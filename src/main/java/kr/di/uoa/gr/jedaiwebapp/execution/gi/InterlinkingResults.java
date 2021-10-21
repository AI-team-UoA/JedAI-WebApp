package kr.di.uoa.gr.jedaiwebapp.execution.gi;

import datamodel.RelatedGeometries;

/**
 * @author George Mandilaras (NKUA)
 */
public class InterlinkingResults {
    public String algorithm;
    public String sourceFilename;
    public String targetFilename;
    public int sourceInstances;
    public int targetInstances;
    public int contains;
    public int covers;
    public int coveredBy;
    public int crosses;
    public int equals;
    public int intersects;
    public int overlaps;
    public int touches;
    public int within;
    public int verifications;
    public int qualifyingPairs;
    public long totalRelations;
    public long executionTime;
    public String details;

    public InterlinkingResults(String alg, RelatedGeometries relatedGeometries, int sourceLength, String sFilename, int targetLength, String tFilename, long time, String textResults){
        algorithm = alg;
        sourceInstances = sourceLength;
        targetInstances = targetLength;
        contains = relatedGeometries.getNoOfContains();
        covers = relatedGeometries.getNoOfCovers();
        coveredBy = relatedGeometries.getNoOfCoveredBy();
        crosses = relatedGeometries.getNoOfCrosses();
        equals = relatedGeometries.getNoOfEquals();
        intersects = relatedGeometries.getNoOfIntersects();
        overlaps = relatedGeometries.getNoOfOverlaps();
        touches = relatedGeometries.getNoOfTouches();
        within = relatedGeometries.getNoOfWithin();
        verifications = relatedGeometries.getVerifiedPairs();
        qualifyingPairs = relatedGeometries.getInterlinkedPairs();
        executionTime = time;
        details = textResults;

        totalRelations = contains+covers+coveredBy+crosses+equals+intersects+overlaps+touches+within;
        sourceFilename = sFilename;
        targetFilename = tFilename;
    }

    public void setSourceInstances(int sourceInstances) {
        this.sourceInstances = sourceInstances;
    }

    public void setTargetInstances(int targetInstances) {
        this.targetInstances = targetInstances;
    }

    public void setContains(int contains) {
        this.contains = contains;
    }

    public void setCovers(int covers) {
        this.covers = covers;
    }

    public void setCoveredBy(int coveredBy) {
        this.coveredBy = coveredBy;
    }

    public void setCrosses(int crosses) {
        this.crosses = crosses;
    }

    public void setEquals(int equals) {
        this.equals = equals;
    }

    public void setIntersects(int intersects) {
        this.intersects = intersects;
    }

    public void setOverlaps(int overlaps) {
        this.overlaps = overlaps;
    }

    public void setTouches(int touches) {
        this.touches = touches;
    }

    public void setWithin(int within) {
        this.within = within;
    }

    public void setVerifications(int verifications) {
        this.verifications = verifications;
    }

    public void setQualifyingPairs(int qualifyingPairs) {
        this.qualifyingPairs = qualifyingPairs;
    }

    public void setExecutionTime(long executionTime) {
        this.executionTime = executionTime;
    }

    public int getSourceInstances() {
        return sourceInstances;
    }

    public int getTargetInstances() {
        return targetInstances;
    }

    public int getContains() {
        return contains;
    }

    public int getCovers() {
        return covers;
    }

    public int getCoveredBy() {
        return coveredBy;
    }

    public int getCrosses() {
        return crosses;
    }

    public int getEquals() {
        return equals;
    }

    public int getIntersects() {
        return intersects;
    }

    public int getOverlaps() {
        return overlaps;
    }

    public int getTouches() {
        return touches;
    }

    public int getWithin() {
        return within;
    }

    public int getVerifications() {
        return verifications;
    }

    public int getQualifyingPairs() {
        return qualifyingPairs;
    }

    public long getExecutionTime() {
        return executionTime;
    }

    public String getSourceFilename() {
        return sourceFilename;
    }

    public String getTargetFilename() {
        return targetFilename;
    }

    public long getTotalRelations() {
        return totalRelations;
    }

    public String getDetails() {
        return details;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public void setSourceFilename(String sourceFilename) {
        this.sourceFilename = sourceFilename;
    }

    public void setTargetFilename(String targetFilename) {
        this.targetFilename = targetFilename;
    }

    public void setTotalRelations(long totalRelations) {
        this.totalRelations = totalRelations;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}
