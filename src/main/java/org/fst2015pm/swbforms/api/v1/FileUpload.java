/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.fst2015pm.swbforms.api.v1;

import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.text.Normalizer;

@WebServlet(urlPatterns = {"/app/fileupload", "/app/fileupload/*"})
@MultipartConfig
public class FileUpload extends HttpServlet {

    private final String IMAGES_PATH = "/images/pm";


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
        HttpSession session = request.getSession();
        SWBScriptEngine engine = DataMgr.initPlatform("/WEB-INF/dbdatasources.js", session);
        SWBDataSource ds = engine.getDataSource("MagicTown");

        String _oldImage = "";
        String filename = "";
        String imagePath = "";
        String strParameter = request.getParameter("_id");
        DataObject pm = new DataObject();
        if (strParameter != null) {
            pm = saveData(request);
            pm.addParam("_id", strParameter);
            DataObject objOld = ds.fetchObjById(strParameter);
            if(objOld.getString("PICTURE") != null) {
                _oldImage = objOld.getString("PICTURE");
            }
        } else {
            DataObject data = saveData(request);
            pm = ds.addObj(data).getDataObject("response").getDataObject("data");
            strParameter = pm.getString("_id");
        }

        Part filePart = request.getPart("file");
        if (filePart != null && filePart.getSize() > 0) {
            filename = getFileName(filePart);
            filename = Normalizer.normalize(filename, Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "").replaceAll(" ", "_");
            imagePath = getImagePath(strParameter);
            inputStreamToFile(filePart.getInputStream(), request.getServletContext().getRealPath(imagePath), filename);
            pm.addParam("PICTURE", filename);
            if(_oldImage != "") {
                File oldImage = new File(request.getServletContext().getRealPath(imagePath) + "/" + _oldImage);
                oldImage.delete();
            }
        } else {
            System.out.println("error file");
        }
        ds.updateObj(pm);
    }

    private DataObject saveData(HttpServletRequest request) {
        DataObject pm = new DataObject();
        if (request.getParameter("NAME") != null && !request.getParameter("NAME").isEmpty()) {
            pm.addParam("NAME", request.getParameter("NAME"));
            if (request.getParameter("DESCRIPTION") != null && !request.getParameter("DESCRIPTION").isEmpty()) {
                pm.addParam("DESCRIPTION", request.getParameter("DESCRIPTION"));
            }
            if (request.getParameter("CVE_ENT") != null && !request.getParameter("CVE_ENT").isEmpty()) {
                pm.addParam("CVE_ENT", request.getParameter("CVE_ENT"));
            }
            if (request.getParameter("CVE_MUN") != null && !request.getParameter("CVE_MUN").isEmpty()) {
                pm.addParam("CVE_MUN", request.getParameter("CVE_MUN"));
            }
            if (request.getParameter("CVE_MTW") != null && !request.getParameter("CVE_MTW").isEmpty()) {
                pm.addParam("CVE_MTW", request.getParameter("CVE_MTW"));
            }
            if (request.getParameter("ACCEPTED") != null && !request.getParameter("ACCEPTED").isEmpty()) {
                pm.addParam("ACCEPTED", Boolean.parseBoolean(request.getParameter("ACCEPTED")));
            }

        }
        return pm;
    }

    private static String inputStreamToFile(InputStream is, String fileDir, String fileName) throws FileNotFoundException, IOException {
        String filepath = "";

        File dir = new File(fileDir);
        dir.mkdirs();
        File file = new File(fileDir, fileName);
        file.createNewFile();

        try (OutputStream os = new FileOutputStream(file)) {
            byte[] buffer = new byte[1024];
            int bytesRead;
            //read from is to buffer
            while ((bytesRead = is.read(buffer)) != -1) {
                os.write(buffer, 0, bytesRead);
            }

            filepath = file.getAbsolutePath();
            is.close();
            os.flush();
        }
        return filepath;
    }

    private String getImagePath(String id) {
        StringBuilder path = new StringBuilder(IMAGES_PATH);
        if (id != null && !id.isEmpty() && id.lastIndexOf(":") > 0) {
            path.append("/");
            path.append(id.substring(id.lastIndexOf(":") + 1));

        }
        return path.toString();
    }

    private String getFileName(Part part) {
        String contentDisp = part.getHeader("content-disposition");
        String[] tokens = contentDisp.split(";");
        for (String token : tokens) {
            if (token.trim().startsWith("filename")) {
                return token.substring(token.indexOf("=") + 2, token.length() - 1);
            }
        }
        return "";
    }

    private String getContentType(Part part) {
        String contentType = part.getHeader("content-type");
        return contentType;
    }
}
