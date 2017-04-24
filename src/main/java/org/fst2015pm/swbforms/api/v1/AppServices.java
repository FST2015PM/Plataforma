package org.fst2015pm.swbforms.api.v1;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.Iterator;
import java.util.Properties;
import java.util.SortedMap;
import java.util.UUID;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.io.FileUtils;
import org.fst2015pm.swbforms.utils.CSVDBFReader;
import org.fst2015pm.swbforms.utils.FSTUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.semanticwb.datamanager.DataList;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

/**
 * REST endpoint for app services
 * @author Hasdai Pacheco
 */
@Path("/services")
public class AppServices {
	@Context ServletContext context;
	@Context HttpServletRequest httpRequest;
	private final static String ERROR_FORBIDDEN = "{\"error\":\"Unauthorized\"}";
	private final static String ERROR_BADREQUEST = "{\"error\":\"Bad request\"}";
	
	@GET
	@Path("/encoding")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAvailableCharsets() {
		HttpSession session = httpRequest.getSession();

		if (null != session.getAttribute("_USER_")) {
			SortedMap<String, Charset> map = Charset.availableCharsets();
			JSONArray ret = new JSONArray();
			for(String key : map.keySet()) {
				ret.put(key);
			}
			return Response.ok(ret.toString()).build();
		} else {
			return Response.status(Status.FORBIDDEN).build();
		}
	}
	
	@Path("/csvpreview")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public Response doPreviewCSV(String content) {//TODO: Restrict session access
		HttpSession session = httpRequest.getSession();
		if (null == session.getAttribute("_USER_")) return Response.status(401).entity(ERROR_FORBIDDEN).build();
		
		try {
			JSONObject payload = new JSONObject(content);
			String fileUrl = payload.getString("fileLocation");
			String encoding = payload.optString("charset", "UTF-8");
			String relPath = payload.optString("zipPath", "tempFile.csv");
			boolean zipped = payload.optBoolean("zipped", false);
			
			//Download resource
			String folderUUID = UUID.randomUUID().toString().replace("-", "");
			String destPath = org.apache.commons.io.FileUtils.getTempDirectoryPath() + folderUUID;
			File destDir = new File(destPath,"tempFile"+(zipped ? "" : ".csv"));
			
			URL url = null;
			try {
				url = new URL(fileUrl);
			} catch (MalformedURLException muex) {
				return Response.status(Status.BAD_REQUEST).entity(ERROR_BADREQUEST).build();
			}
			
			System.out.println("..Downloading resource "+url);
			org.apache.commons.io.FileUtils.copyURLToFile(url, destDir, 5000, 5000);
			if (zipped) {
				System.out.println("..Inflating "+url);
				FSTUtils.ZIP.extractAll(destDir.getAbsolutePath(), destPath);
			}
			
			CSVDBFReader reader;
			if (!"UTF-8".equals(encoding)) {
				Properties props = new Properties();
				props.put("charset", encoding);
				reader = new CSVDBFReader(destPath, props);
			} else {
				reader = new CSVDBFReader(destPath);
			}
			
			JSONObject ret = reader.readJSON(relPath, true, 10);
			ret.put("uuid", folderUUID);
					
			return Response.ok(ret.toString()).build();
		} catch(JSONException jsex) {
			jsex.printStackTrace();
			return Response.status(Status.BAD_REQUEST).entity(ERROR_BADREQUEST).build(); 
		} catch (IOException ioex) {
			ioex.printStackTrace();
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	@Path("/dsendpoint")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response doGetDSEndpoints() {
		HttpSession session = httpRequest.getSession();
		if (null == session.getAttribute("_USER_")) return Response.status(401).entity(ERROR_FORBIDDEN).build();
		
		SWBScriptEngine engine = DataMgr.initPlatform(session);
		SWBDataSource endpoints = engine.getDataSource("DSEndpoint");
		
		try {
			DataObject fetch = endpoints.fetch();
			if (null != fetch) {
				return Response.ok(fetch.getDataObject("response")).build();
			}
			return Response.ok("{data:[]}").build();
		} catch (IOException ioex) {
			ioex.printStackTrace();
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	@Path("/updatedbsources")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public Response doUpdateDBDataSources() {
		HttpSession session = httpRequest.getSession();
		if (null == session.getAttribute("_USER_")) return Response.status(Status.FORBIDDEN).entity(ERROR_FORBIDDEN).build();
		
		try {
			updateDBDataSources(session);
			return Response.ok().build();
		} catch (IOException ioex) {
			ioex.printStackTrace();
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	private synchronized void updateDBDataSources(HttpSession session) throws IOException {
		SWBScriptEngine engine = DataMgr.initPlatform(session);
		SWBDataSource dbsources = engine.getDataSource("DBDataSource");
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
			sb.append("  secure: ").append(Boolean.valueOf(obj.getBoolean("restricted")));
			
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
		
		File f = new File(context.getRealPath("/") + "WEB-INF/dbdatasources.js");
		FileUtils.write(f, sb.toString(), "UTF-8", false);
	}
}
