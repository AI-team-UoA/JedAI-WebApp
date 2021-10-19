package kr.di.uoa.gr.jedaiwebapp.execution.gi;

import batch.partitionbased.PBSM;
import batch.planesweep.PlaneSweep;
import batch.stripebased.StripeSTRSweep;
import batch.tilebased.GIAnt;
import batch.tilebased.RADON;
import batch.treebased.CRTree;
import batch.treebased.QuadTree;
import batch.treebased.RTree;
import datamodel.PlaneSweepStructure;
import datareader.*;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.HttpPaths;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.JedaiOptions;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
    public static void run(){
        switch (algorithm) {
            case JedaiOptions.GIANT:
                GIAnt giant = new GIAnt(0, source, target);
                giant.applyProcessing();
                giant.printResults();
                break;
            case JedaiOptions.CRTREE:
                CRTree crTree = new CRTree(0, source, target);
                crTree.applyProcessing();
                crTree.printResults();
                break;
            case JedaiOptions.PLANE_SWEEP:
                PlaneSweep planeSweep = new PlaneSweep(0, source, target, PlaneSweepStructure.LIST_SWEEP);
                planeSweep.applyProcessing();
                planeSweep.printResults();
                break;
            case JedaiOptions.STRIPE_SWEEP:
                StripeSTRSweep sss = new StripeSTRSweep(0, source, target);
                sss.applyProcessing();
                sss.printResults();
                break;
            case JedaiOptions.PBSM:
                PBSM join = new PBSM(0, source, target, PlaneSweepStructure.STRIPED_SWEEP);
                join.applyProcessing();
                join.printResults();
                break;
            case JedaiOptions.QUADTREE:
                QuadTree quadTree = new QuadTree(0, source, target);
                quadTree.applyProcessing();
                quadTree.printResults();
                break;
            case JedaiOptions.RTREE:
                RTree rTree = new RTree(0, source, target);
                rTree.applyProcessing();
                rTree.printResults();
                break;
            case JedaiOptions.RADON:
                RADON radon = new RADON(0, source, target);
                radon.applyProcessing();
                radon.printResults();
                break;
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
