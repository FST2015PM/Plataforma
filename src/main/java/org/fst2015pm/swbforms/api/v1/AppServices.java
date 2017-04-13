package org.fst2015pm.swbforms.api.v1;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.Properties;
import java.util.SortedMap;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.fst2015pm.swbforms.utils.CSVDBFReader;
import org.fst2015pm.swbforms.utils.FSTUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * REST endpoint for app services
 * @author Hasdai Pacheco
 */
@Path("/services")
public class AppServices {
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
			
			return Response.status(200).entity(ret.toString()).build();
		}
		
		return Response.status(401).build();
	}
	
	@Path("/csvpreview")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public Response doPreviewCSV(String content) {//TODO: Restrict session access
		HttpSession session = httpRequest.getSession();
		if (null == session.getAttribute("_USER_")) return Response.status(301).entity(ERROR_FORBIDDEN).build();
		
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
				return Response.status(400).entity(ERROR_BADREQUEST).build();
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
					
			return Response.status(200).entity(ret.toString()).build();
		} catch(JSONException jsex) {
			jsex.printStackTrace();
			return Response.status(400).entity(ERROR_BADREQUEST).build(); 
		} catch (IOException ioex) {
			ioex.printStackTrace();
			return Response.status(500).build();
		}
	}
}
