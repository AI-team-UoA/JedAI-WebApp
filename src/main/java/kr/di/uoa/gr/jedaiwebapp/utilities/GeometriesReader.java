package kr.di.uoa.gr.jedaiwebapp.utilities;

import org.locationtech.jts.io.WKTReader;

public class GeometriesReader {
    WKTReader wktReader;

    public GeometriesReader(){
        wktReader = new WKTReader();
    }
}
