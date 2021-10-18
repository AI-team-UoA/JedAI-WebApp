package kr.di.uoa.gr.jedaiwebapp.execution.gi;

import kr.di.uoa.gr.jedaiwebapp.utilities.GeometriesReader;
import org.json.JSONObject;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.io.ParseException;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Objects;

public class StaticGeospatialReader {

    public static List<Geometry>  source;
    public static List<Geometry>  target;

    static GeometriesReader reader = new GeometriesReader();

    public static String setDataset(JSONObject configurations, String inputPath) {
        try{
            String entity_id = configurations.getString("entity_id");
            String filetype = configurations.getString("filetype");
            if (Objects.equals(entity_id, "source"))
                source = read(filetype, inputPath, configurations);
            else
                target = read(filetype, inputPath, configurations);
            return "SUCCESS";
        } catch (Exception e){
            return "ERROR: " + e.getClass().getSimpleName();
        }
    }

    public static List<Geometry> read(String filetype, String inputPath, JSONObject configurations) throws ParseException, IOException {
        if (Objects.equals(filetype, "CSV")) {
            boolean hasHeader = configurations.getBoolean("first_row");
            char separator = configurations.getString("separator").replace("\\t", "\t").charAt(0);
            int geometryIndex = configurations.getInt("geometry_index");
            int idIndex = configurations.getInt("id_index");
            return reader.readCSV(inputPath, hasHeader, separator, geometryIndex, idIndex);
        } else {
            String geometryPredicate = configurations.getString("geometry_predicate");
            return reader.readRDF(inputPath, geometryPredicate);
        }
    }
}
