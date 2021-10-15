package kr.di.uoa.gr.jedaiwebapp.controllers.gi;

import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.HttpPaths;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping(HttpPaths.giDataReadPath + "**")
public class GeometriesLoaderController {

    @Autowired
    private HttpServletRequest request;
    //TODO read input
    @PostMapping(path = HttpPaths.giDataReadPath + "setConfigurationWithFile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void setDatasetWithFile(@RequestPart(value="file") MultipartFile file, @RequestPart String json_conf){
        System.out.println("Geospatial Interlinker Loader");
        JSONObject configurations = new JSONObject(json_conf);
        String source = UploadFile(file);
        StaticGeospatialReader.setDataset(configurations, source);
    }


    /**
     * Upload the input file in the server
     * @param file the input file
     * @return the path
     **/
    public String UploadFile(MultipartFile file) {
        String realPathToUploads =  request.getServletContext().getRealPath("/uploads/");
        if(! new File(realPathToUploads).exists())
            new File(realPathToUploads).mkdir();
        String filename = StringUtils.cleanPath(file.getOriginalFilename());
        String filepath = realPathToUploads + filename;
        File dest = new File(filepath);
        if(! dest.exists()) {
            try {
                file.transferTo(dest);
                System.out.println("File was stored Successfully in "+ filepath);
            } catch (IllegalStateException | IOException e) {
                e.printStackTrace();
            }
        }
        else {
            System.out.println("File already exist in "+ filepath);
        }
        return filepath;
    }

}
