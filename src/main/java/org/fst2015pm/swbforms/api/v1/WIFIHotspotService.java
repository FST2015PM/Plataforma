package org.fst2015pm.swbforms.api.v1;

import java.io.IOException;
import java.util.Iterator;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.semanticwb.datamanager.DataList;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

@Path ("/services/wifi")
public class WIFIHotspotService {
	@Context HttpServletRequest httpRequest;
	@Context ServletContext context;
	
	boolean useCookies = false;
	final static String ERROR_FORBIDDEN = "{\"error\":\"Unauthorized\"}";
	final static String ERROR_BADREQUEST = "{\"error\":\"Bad request\"}";
	PMCredentialsManager mgr;
	
	public WIFIHotspotService() {
		//Create credentials manager
		mgr = new PMCredentialsManager();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getHotspots() {
		HttpSession session = httpRequest.getSession();
		SWBScriptEngine engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
		Response ret = null;
		
		if (!mgr.validateCredentials(httpRequest, useCookies, true)) {
			return Response.status(401).entity(ERROR_FORBIDDEN).build();
		} else {
			SWBDataSource ds = engine.getDataSource("WifiHotSpot");
			DataObject dsFetch = null;
			
			try {
				DataObject wrapper = new DataObject();
				wrapper.put("data", new DataObject());
				dsFetch = ds.fetch(wrapper);
				
				if (null != dsFetch) {
					DataObject response = dsFetch.getDataObject("response");
					if (null != response) {
						DataList dlist = response.getDataList("data");
						if (!dlist.isEmpty()) {
							ret = Response.status(200).entity(dlist).build();
						} else {
							ret = Response.status(200).entity("[]").build();
						}
					}
				} else {
					ret = Response.status(500).build();
				}
			} catch (Exception ex) {
				ex.printStackTrace();
				ret = Response.status(500).build();
			}
		}
		
		return ret;
	}
	
	@GET
	@Path("/{objId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getHotspot(@PathParam("objId") String oId) {
		HttpSession session = httpRequest.getSession();
		SWBScriptEngine engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
		Response ret = null;
		
		if (!mgr.validateCredentials(httpRequest, useCookies, true)) {
			return Response.status(401).entity(ERROR_FORBIDDEN).build();
		} else {
			SWBDataSource ds = engine.getDataSource("WifiHotSpot");
			DataObject dsFetch = null;
			
			try {
				dsFetch = ds.fetchObjById(oId);
				
				if (null != dsFetch) {
					ret = Response.status(200).entity(dsFetch).build();
				} else {
					ret = Response.status(400).build();
				}
			} catch (Exception ex) {
				ex.printStackTrace();
				ret = Response.status(500).build();
			}
		}
		
		return ret;
	}
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response addHotspot(String content) throws IOException {
		HttpSession session = httpRequest.getSession();
		SWBScriptEngine engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
		SWBDataSource ds = engine.getDataSource("WifiHotSpot"); 
		
		if (!mgr.validateCredentials(httpRequest, useCookies, true)) {
			return Response.status(401).entity(ERROR_FORBIDDEN).build();
		} else {
			if (null == ds) {
				return Response.status(500).build();
			}
			
			try {
				JSONArray objArray = new JSONArray(content);
				JSONArray retArray = new JSONArray();
				
				Iterator<Object> it = objArray.iterator();
				while(it.hasNext()) {
					JSONObject objData = (JSONObject)it.next();//objArray.getJSONObject(i);
					objData.remove("_id");
					
					//Transform JSON to dataobject to avoid fail
					DataObject obj = (DataObject) DataObject.parseJSON(objData.toString());					
					DataObject objNew = ds.addObj(obj);
					DataObject response = objNew.getDataObject("response");

					if (null != response && 0 == response.getInt("status")) {
						DataObject dlist = response.getDataObject("data");
						JSONObject el = new JSONObject();
						el.put("_id", dlist.getId());
						retArray.put(el);
					}
				}
				return Response.status(200).entity(retArray.toString()).build();
			} catch (JSONException jspex) {
				return Response.status(400).entity(ERROR_BADREQUEST).build();
			}
		}
	}
}
