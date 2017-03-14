package org.pm.services;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Reader;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.json.JSONObject;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

/**
 *
 * @author martha.jimenez
 */
@WebServlet(urlPatterns = {"/servicespm", "/servicespm/*"})
public class ServicesPM extends HttpServlet {

    private static final String ACTION_LIST = "list";
    private static final String ACTION_DETAIL = "detail";
    private static final String ACTION_ADD = "add";
    private static final String ACTION_UPDATE = "update";
    private static final String ACTION_DELETE = "delete";
    private final String IMAGES_PATH = "/images/pm";

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        processRequest(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        processRequest(req, resp);
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        processRequest(req, resp);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        processRequest(req, resp);
    }

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        SWBScriptEngine engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
        SWBDataSource ds = engine.getDataSource("PMCatalog");
        PrintWriter out = response.getWriter();
        response.setContentType("application/json");
        String action = request.getParameter("action");
        switch (action) {
            case ACTION_ADD:
                StringBuilder sbRequest = getParameters(request.getReader());
                JSONObject jsonPM = new JSONObject(sbRequest.toString());
                DataObject pm = saveData(jsonPM);
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                String date = sdf.format(new Date());
                pm.addParam("fechaIncorporacion", date);
                ds.addObj(pm);
                break;
            case ACTION_DELETE:
                if (request.getParameter("id") != null && !request.getParameter("id").isEmpty()) {
                    DataObject obj = ds.fetchObjById(request.getParameter("id"));
                    if (obj.getString("imagen") != null) {
                        String imagePath = getImagePath(obj.getString("_id"));
                        File oldImage = new File(request.getServletContext().getRealPath(imagePath));
                        oldImage.delete();
                    }
                    ds.removeObj(obj);
                }
                break;
            case ACTION_DETAIL:
                String paramPM = request.getParameter("_id");
                if (paramPM != null && !paramPM.isEmpty()) {
                    out.print(ds.fetchObjById(paramPM));
                }
                break;
            case ACTION_LIST:
                DataObject dsFetch = ds.fetch();
                out.print(dsFetch.getDataObject("response"));
                break;
            case ACTION_UPDATE:
                sbRequest = getParameters(request.getReader());
                jsonPM = new JSONObject(sbRequest.toString());

                if (jsonPM.has("_id") && !jsonPM.getString("_id").isEmpty()) {
                    pm = saveData(jsonPM);
                    pm.addParam("_id", jsonPM.getString("_id"));
                    ds.updateObj(pm);
                }
                break;
            default:
                break;
        }
    }

    private String getImagePath(String id) {
        StringBuffer path = new StringBuffer(IMAGES_PATH);
        if (id != null && !id.isEmpty() && id.lastIndexOf(":") > 0) {
            path.append("/");
            path.append(id.substring(id.lastIndexOf(":") + 1));

        }
        return path.toString();
    }

    private StringBuilder getParameters(Reader reader) throws IOException {
        StringBuilder sbRequest = new StringBuilder(128);
        char[] input = new char[128];
        int inBuffer = reader.read(input);
        while (inBuffer > 0) {
            sbRequest.append(input, 0, inBuffer);
            inBuffer = reader.read(input);
        }
        return sbRequest;
    }

    private DataObject saveData(JSONObject jsonPM) {
        DataObject pm = new DataObject();
        if (jsonPM.has("nombre") && !jsonPM.getString("nombre").isEmpty()) {
            pm.addParam("nombre", jsonPM.getString("nombre"));
            if (jsonPM.has("descripcion")) {
                pm.addParam("descripcion", jsonPM.getString("descripcion"));
            }
            if (jsonPM.has("claveEstado")) {
                pm.addParam("claveEstado", jsonPM.getString("claveEstado"));
            }
            if (jsonPM.has("claveMunicipio")) {
                pm.addParam("claveMunicipio", jsonPM.getString("claveMunicipio"));
            }
            if (jsonPM.has("claveGeo")) {
                pm.addParam("claveGeo", jsonPM.getString("claveGeo"));
            }
            if (jsonPM.has("incorporado")) {
                pm.addParam("incorporado", jsonPM.getBoolean("incorporado"));
            }

        }
        return pm;
    }
}
