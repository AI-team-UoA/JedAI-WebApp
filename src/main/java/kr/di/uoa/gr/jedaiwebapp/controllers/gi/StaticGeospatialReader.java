package kr.di.uoa.gr.jedaiwebapp.controllers.gi;

import kr.di.uoa.gr.jedaiwebapp.utilities.GeometriesReader;
import org.json.JSONObject;
import org.locationtech.jts.geom.Geometry;

import java.io.File;
import java.util.List;
import java.util.Objects;

public class StaticGeospatialReader {

    public static List<Geometry>  source;
    public static List<Geometry>  target;

    static GeometriesReader reader = new GeometriesReader();

    public static void setDataset(JSONObject configurations, String source) {
            if (new File(source).exists()) {
                String entity_id = configurations.getString("entity_id");
                String filetype = configurations.getString("filetype");

                if (Objects.equals(entity_id, "source"))
                    System.out.println("READ SOURCE");
                else
                    System.out.println("READ TARGET");
            }
            else
                System.out.println("File does not exist");
    }


}
