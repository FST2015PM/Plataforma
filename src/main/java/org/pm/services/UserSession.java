/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package org.pm.services;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.semanticwb.datamanager.DataList;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

/**
 *
 * @author Martha
 */
@WebServlet(urlPatterns = {"/role"})
public class UserSession extends HttpServlet {

    private static final String GET_MAP_ROLES = "mapRoles";

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        processRequest(req, resp);
    }

    private void processRequest(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String action = req.getParameter("action");
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        switch (action) {
            case GET_MAP_ROLES:
                HttpSession session = req.getSession();
                SWBScriptEngine engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
                SWBDataSource ds = engine.getDataSource("Permission");
                List roles = (ArrayList) session.getAttribute("role");
                DataList list2 = ds.fetch().getDataObject("response").getDataList("data");
                DataList pages = new DataList();
                for (int i = 0; i < list2.size(); i++) {
                    DataObject permission = list2.getDataObject(i);
                    if (!getPermissionUsr(roles, permission)) {
                        permission.addParam("permission", false);
                        pages.add(permission);
                    }
                }
                out.print(pages);
                break;
            default:
                break;
        }

    }

    private boolean getPermissionUsr(List<String> roles, DataObject permission) {
        if (roles != null && permission.containsKey("roles")) {
            DataList listRoles = permission.getDataList("roles");
            if (listRoles.size() == 0) {
                return true;
            }
            for (int i = 0; i < listRoles.size(); i++) {
                for (String role : roles) {
                    if (role.equals(listRoles.getString(i))) {
                        return true;
                    }
                }
            }
        } else {
            return true;
        }
        return false;
    }
}
