package kr.di.uoa.gr.jedaiwebapp.utilities;

import com.opencsv.CSVReader;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;
import org.apache.jena.riot.RDFDataMgr;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKTReader;

import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class GeometriesReader {
    WKTReader wktReader;

    public GeometriesReader(){
        wktReader = new WKTReader();
    }


    public List<Geometry> readCSV(String inputFilePath, boolean hasHeader, char separator, int geometryIndex, int idIndex) throws ParseException, IOException {
        final WKTReader wktReader = new WKTReader();
        final List<Geometry> loadedEntities = new ArrayList<>();
        final CSVReader csvReader = new CSVReader(new FileReader(inputFilePath), separator);
        //getting first line
        if(hasHeader) csvReader.readNext();
        //read entity profiles
        String[] nextLine;
        while ((nextLine = csvReader.readNext()) != null) {
            final Geometry geometry = wktReader.read(nextLine[geometryIndex]);
            loadedEntities.add(geometry);
        }
        return loadedEntities;
    }


    public List<Geometry> readRDF(String inputFilePath, String geometryPredicate) throws ParseException, IOException {
        final WKTReader wktReader = new WKTReader();
        final List<Geometry> loadedEntities = new ArrayList<>();
        Model model = RDFDataMgr.loadModel(inputFilePath);
        for (final StmtIterator it = model.listStatements(); it.hasNext();) {
            final Statement s = it.nextStatement();
            if (Objects.equals(geometryPredicate, s.getPredicate().getLocalName())) {
                String wkt = s.getObject().asResource().getLocalName();
                Geometry geometry = wktReader.read(wkt);
                loadedEntities.add(geometry);
            }
        }
        return loadedEntities;
    }
}
