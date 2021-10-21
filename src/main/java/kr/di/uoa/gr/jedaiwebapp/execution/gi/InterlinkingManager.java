package kr.di.uoa.gr.jedaiwebapp.execution.gi;

import batch.AbstractBatchAlgorithm;
import batch.partitionbased.PBSM;
import batch.planesweep.PlaneSweep;
import batch.stripebased.StripeSTRSweep;
import batch.tilebased.GIAnt;
import batch.tilebased.RADON;
import batch.tilebased.StaticGIAnt;
import batch.tilebased.StaticRADON;
import batch.treebased.CRTree;
import batch.treebased.QuadTree;
import batch.treebased.RTree;
import datamodel.PlaneSweepStructure;
import datamodel.RelatedGeometries;
import datareader.*;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.HttpPaths;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.JedaiOptions;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Calendar;
import java.util.HashSet;
import java.util.Objects;


// TODO
//  1) return results to front-end
//  2) Learn why we need QP in constructors
//  3) how the benchmark and map should look like
//  4) export
@RestController
@RequestMapping(HttpPaths.giReadData + "**")
public class InterlinkingManager {

    static public String algorithmType;
    static public String algorithm;
    static public int budget;
    public static AbstractReader source;
    public static AbstractReader target;


    public static String setDataset(JSONObject configurations, String inputPath) {
        try{
            String entity_id = configurations.getString("entity_id");
            String filetype = configurations.getString("filetype");
            if (Objects.equals(entity_id, "source"))
                source = getReader(filetype, inputPath, configurations);
            else
                target = getReader(filetype, inputPath, configurations);
            return "SUCCESS";
        } catch (Exception e){
            return "ERROR: " + e.getClass().getSimpleName();
        }
    }

    public static AbstractReader getReader(String filetype, String inputPath, JSONObject configurations) throws Exception {
        if (Objects.equals(filetype, "CSV")) {
            boolean hasHeader = configurations.getBoolean("first_row");
            char separator = configurations.getString("separator").replace("\\t", "\t").charAt(0);
            int geometryIndex = configurations.getInt("geometry_index");
            return new GeometryCSVReader(hasHeader, separator, geometryIndex, new int[0], inputPath);
        } else if (Objects.equals(filetype, "GEOJSON")) {
            return new GeometryGeoJSONReader(inputPath);
        } else if (Objects.equals(filetype, "RDF")) {
            return new GeometryRDFReader(inputPath, new HashSet<String>());
        } else if (Objects.equals(filetype, "RDF/JSON")) {
            String prefix = configurations.getString("prefix");
            return new GeometryJSONRDFReader(inputPath, prefix, new HashSet<>());
        } else{
            return new GeometrySerializationReader(inputPath);
        }
    }

    // TODO add static algorithms
    public static InterlinkingResults run(){
        long time = Calendar.getInstance().getTimeInMillis();
        AbstractBatchAlgorithm processor;
        switch (algorithm) {
            case JedaiOptions.STATIC_GIANT:
                processor = new StaticGIAnt(0, source, target);
                break;
            case JedaiOptions.RADON:
                processor = new RADON(0, source, target);
                break;
            case JedaiOptions.STATIC_RADON:
                processor = new StaticRADON(0, source, target);
                break;
            case JedaiOptions.CRTREE:
                processor = new CRTree(0, source, target);
                break;
            case JedaiOptions.PLANE_SWEEP:
                processor = new PlaneSweep(0, source, target, PlaneSweepStructure.LIST_SWEEP);
                break;
            case JedaiOptions.STRIPE_SWEEP:
                processor = new StripeSTRSweep(0, source, target);
                break;
            case JedaiOptions.PBSM:
                processor = new PBSM(0, source, target, PlaneSweepStructure.STRIPED_SWEEP);
                break;
            case JedaiOptions.QUADTREE:
                processor = new QuadTree(0, source, target);
                break;
            case JedaiOptions.RTREE:
                processor = new RTree(0, source, target);
                break;
            default:
                processor = new GIAnt(0, source, target);
        }
        processor.applyProcessing();
        RelatedGeometries relatedGeometries = processor.getResults();
        time = Calendar.getInstance().getTimeInMillis() - time;
        System.out.println("Interlinker completed in " + time+"ms");
        return new InterlinkingResults(relatedGeometries, source.getSize(), target.getSize(), time, processor.getResultsText());
    }


    public static String getConfiguration(String algorithm) {
        try{
            AbstractBatchAlgorithm processor;
            switch (algorithm) {
                case JedaiOptions.STATIC_GIANT:
                    processor = new StaticGIAnt(0, source, target);
                    break;
                case JedaiOptions.RADON:
                    processor = new RADON(0, source, target);
                    break;
                case JedaiOptions.STATIC_RADON:
                    processor = new StaticRADON(0, source, target);
                    break;
                case JedaiOptions.CRTREE:
                    processor = new CRTree(0, source, target);
                    break;
                case JedaiOptions.PLANE_SWEEP:
                    processor = new PlaneSweep(0, source, target, PlaneSweepStructure.LIST_SWEEP);
                    break;
                case JedaiOptions.STRIPE_SWEEP:
                    processor = new StripeSTRSweep(0, source, target);
                    break;
                case JedaiOptions.PBSM:
                    processor = new PBSM(0, source, target, PlaneSweepStructure.STRIPED_SWEEP);
                    break;
                case JedaiOptions.QUADTREE:
                    processor = new QuadTree(0, source, target);
                    break;
                case JedaiOptions.RTREE:
                    processor = new RTree(0, source, target);
                    break;
                default:
                    processor = new GIAnt(0, source, target);
            }
            return  processor.getMethodInfo();
        }
        catch (UnsupportedOperationException e){
            return "Not supported yet";
        }

    }


    public static void setAlgorithmType(String algorithmType) {
        InterlinkingManager.algorithmType = algorithmType;
    }

    public static void setAlgorithm(String algorithm) {
        InterlinkingManager.algorithm = algorithm;
    }

    public static void setBudget(int budget) {
        InterlinkingManager.budget = budget;
    }

    public static String getAlgorithmType() {
        return algorithmType;
    }

    public static String getAlgorithm() {
        return algorithm;
    }

    public static int getBudget() {
        return budget;
    }
}
