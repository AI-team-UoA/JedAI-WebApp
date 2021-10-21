package kr.di.uoa.gr.jedaiwebapp.execution.gi;

import datamodel.RelatedGeometries;

/**
 * @author George Mandilaras (NKUA)
 */
public class InterlinkingResults {

    public int source_instances;
    public int target_instances;
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
    public int qualifying_pairs;
    public long execution_time;
    public String details;

    public InterlinkingResults(RelatedGeometries relatedGeometries, int sourceLength, int targetLength, long time, String textResults){
        source_instances = sourceLength;
        target_instances = targetLength;
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
        qualifying_pairs = relatedGeometries.getQualifyingPairs();
        execution_time = time;
        details = textResults;
    }

    public void setSource_instances(int source_instances) {
        this.source_instances = source_instances;
    }

    public void setTarget_instances(int target_instances) {
        this.target_instances = target_instances;
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

    public void setQualifying_pairs(int qualifying_pairs) {
        this.qualifying_pairs = qualifying_pairs;
    }

    public void setExecution_time(long execution_time) {
        this.execution_time = execution_time;
    }

    public int getSource_instances() {
        return source_instances;
    }

    public int getTarget_instances() {
        return target_instances;
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

    public int getQualifying_pairs() {
        return qualifying_pairs;
    }

    public long getExecution_time() {
        return execution_time;
    }
}
