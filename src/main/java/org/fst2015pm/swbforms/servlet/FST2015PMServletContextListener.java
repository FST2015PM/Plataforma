package org.fst2015pm.swbforms.servlet;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.Iterator;
import java.util.logging.Logger;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.FileUtils;
import org.fst2015pm.swbforms.extractors.ExtractorManager;
import org.semanticwb.datamanager.DataList;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;
import org.semanticwb.datamanager.script.ScriptObject;

public class FST2015PMServletContextListener implements ServletContextListener {
	static Logger log = Logger.getLogger(FST2015PMServletContextListener.class.getName());
	
	@Override
	public void contextInitialized(ServletContextEvent sce) {
		log.info("Starting FST2015PM Platform...");
        DataMgr.createInstance(sce.getServletContext().getRealPath("/"));
        log.info("DataMgr started");

        log.info("Starting SWBScriptEngine...");
        SWBScriptEngine engine = DataMgr.getUserScriptEngine("/WEB-INF/global.js", (DataObject)null, false);
        log.info("SWBScriptEngine Started");

        ScriptObject config = engine.getScriptObject().get("config");
        if (config != null) {
            String base = config.getString("baseDatasource");
            if (base != null) {
                DataMgr.getBaseInstance().setBaseDatasourse(base);
            }
        }
        
        checkDefaultAccessCredentials(engine, sce);
        
        try {
    		updateDBDataSources(engine, sce);
        } catch (IOException ioex) {
        	ioex.printStackTrace();
        }
        
		ExtractorManager i = ExtractorManager.getInstance();
		i.init();

	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {

	}
	
	private synchronized void updateDBDataSources(SWBScriptEngine eng, ServletContextEvent sce) throws IOException {
		SWBDataSource dbsources = eng.getDataSource("DBDataSource");
		StringBuilder sb = new StringBuilder();
		String newLine = "\n";
		String quoteChar = "\"";
		String colon = ",";
		
		DataObject fetch = dbsources.fetch();
		DataList sources = fetch.getDataObject("response").getDataList("data");
		
		sb.append("var DBModel = \"FST2015PM\";").append(newLine);
		for(int i = 0; i < sources.size(); i++) {
			DataObject obj = sources.getDataObject(i);
			sb.append("eng.dataSources[").append(quoteChar).append(obj.getString("name")).append(quoteChar).append("] = {").append(newLine);
			
			sb.append("  scls: ").append(quoteChar).append(obj.getString("name")).append(quoteChar).append(colon).append(newLine);
			sb.append("  modelid: ").append("DBModel").append(colon).append(newLine);
			sb.append("  dataStore: ").append(quoteChar).append("mongodb").append(quoteChar).append(colon).append(newLine);
			sb.append("  secure:").append(Boolean.valueOf(obj.getBoolean("restricted")));
			
			DataList columns = obj.getDataList("columns");
			if (null != columns && !columns.isEmpty()) {
				sb.append(colon).append(newLine);
				sb.append("  fields: [").append(newLine);
				Iterator colit = columns.iterator(); 
				while (colit.hasNext()) {
					DataObject dob = (DataObject) colit.next();
					sb.append("    {");
					sb.append("name: ").append(quoteChar).append(dob.getString("name")).append(quoteChar).append(colon);
					sb.append("title: ").append(quoteChar).append(dob.getString("title")).append(quoteChar).append(colon);
					sb.append("type: ").append(quoteChar).append(dob.getString("type")).append(quoteChar).append(colon);
					sb.append("required: ").append(Boolean.valueOf(dob.getBoolean("type")));
					sb.append("}");
					if (colit.hasNext()) sb.append(colon);
					
					sb.append(newLine);
				}
				sb.append("  ]").append(newLine);
			} else {
				sb.append(newLine);
			}
			
			sb.append("};").append(newLine);
		}
		
		File f = new File(sce.getServletContext().getRealPath("/") + "WEB-INF/dbdatasources.js");
		FileUtils.write(f, sb.toString(), "UTF-8", false);
	}
	
	private void checkDefaultAccessCredentials(SWBScriptEngine eng, ServletContextEvent sce) {
		File f = new File(sce.getServletContext().getRealPath("/")+"WEB-INF/deployInfo");
		if (!f.exists()) {
			log.info("Creating default admin user...");
			//Create admin role and admin user
	        SWBDataSource roleDS = eng.getDataSource("Role");
	        SWBDataSource userDS = eng.getDataSource("User");
	        
	        DataObject queryObj = new DataObject();
	        queryObj.put("title", "Admin");
	        
	        try {
	        	DataObject response = roleDS.fetch(new DataObject().addParam("data", queryObj));	        	
	        	DataList data = response.getDataObject("response").getDataList("data");
	        	
	        	if (null == data || data.isEmpty()) {
	        		DataObject adminRole = new DataObject();
	        		adminRole.put("title", "Admin");
	        		adminRole.put("description", "Admin Role");
	        		response = roleDS.addObj(adminRole);
	        	}
	        	
	        	if (null != response.getDataObject("response").getDataObject("data")) {
	        		String roleId = response.getDataObject("response").getDataObject("data").getId();
	        		
	        		queryObj = new DataObject();
			        queryObj.put("isAdmin", true);
			        
			        response = userDS.fetch(new DataObject().addParam("data", queryObj));
			        data = response.getDataList("data");
			        
			        if (null == data || data.isEmpty()) {
			        	DataObject userObj = new DataObject();
			        	userObj .put("fullname", "Admin");
			        	userObj .put("email", "admin@fst2015pm.mx");
			        	userObj .put("password", "admin");
			        	userObj .put("isAdmin", true);
			        	DataList rList = new DataList();
			        	rList.add(roleId);
			        	userObj .put("roles", rList);
			        	response = userDS.addObj(userObj);
			        }
			        
		        	FileUtils.writeStringToFile(f, String.valueOf(new Date().toString()), "UTF-8");
	        	}
	        } catch (IOException ioex) {
	        	
	        }
		}
	}

}
