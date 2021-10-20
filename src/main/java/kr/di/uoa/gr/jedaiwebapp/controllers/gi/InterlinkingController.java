package kr.di.uoa.gr.jedaiwebapp.controllers.gi;

import kr.di.uoa.gr.jedaiwebapp.execution.gi.InterlinkingManager;
import kr.di.uoa.gr.jedaiwebapp.utilities.configurations.HttpPaths;
import org.json.JSONObject;
import org.mortbay.util.ajax.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping(HttpPaths.interlinking + "**")
public class InterlinkingController {

    @Autowired
    private HttpServletRequest request;

    @PostMapping(path = HttpPaths.giReadData + "setConfigurationWithFile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String setDatasetWithFile(@RequestPart(value="file") MultipartFile file, @RequestPart String json_conf){
        JSONObject configurations = new JSONObject(json_conf);
        String source = UploadFile(file);
        return InterlinkingManager.setDataset(configurations, source);
    }

    /**
     * Upload the input file in the server
     * @param file the input file
     * @return the path
     **/
    public String UploadFile(MultipartFile file) {
        String realPathToUploads = request.getServletContext().getRealPath("/uploads/");
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


    @GetMapping(HttpPaths.setInterlinking + "{algType}/{algorithm}/{budget}")
    public void setInterlinking(@PathVariable(value = "algType") String algType,
                                @PathVariable(value = "algorithm") String algorithm,
                                @PathVariable(value = "budget") int budget) {
            InterlinkingManager.setAlgorithm(algorithm);
            InterlinkingManager.setBudget(budget);
            InterlinkingManager.setAlgorithmType(algType);
    }


    // TODO TEST
    @GetMapping(HttpPaths.interlinking + "run")
    public JSONObject run() {
        System.out.println("Interlinker Run");
        return InterlinkingManager.run();
    }
}
