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

import org.fst2015pm.swbforms.utils.FSTUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.semanticwb.datamanager.DataList;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

@Path("/services/signal")
public class SignalService {
	@Context HttpServletRequest httpRequest;
	@Context ServletContext context;
	
	boolean useCookies = false;
	final static String ERROR_FORBIDDEN = "{\"error\":\"Unauthorized\"}";
	final static String ERROR_BADREQUEST = "{\"error\":\"Bad request\"}";
	PMCredentialsManager mgr;
	
	public SignalService() {
		//Create credentials manager
		mgr = new PMCredentialsManager();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getSignals() {
		HttpSession session = httpRequest.getSession();
		SWBScriptEngine engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
		Response ret = null;
		
		if (!mgr.validateCredentials(httpRequest, useCookies, true)) {
			return Response.status(401).entity(ERROR_FORBIDDEN).build();
		} else {
			SWBDataSource ds = engine.getDataSource("TourismSignal");
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
	public Response getSignal(@PathParam("objId") String oId) {
		HttpSession session = httpRequest.getSession();
		SWBScriptEngine engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
		Response ret = null;
		
		if (!mgr.validateCredentials(httpRequest, useCookies, true)) {
			return Response.status(401).entity(ERROR_FORBIDDEN).build();
		} else {
			SWBDataSource ds = engine.getDataSource("TourismSignal");
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
	public Response addSignal(String content) throws IOException {
		HttpSession session = httpRequest.getSession();
		SWBScriptEngine engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
		SWBDataSource ds = engine.getDataSource("TourismSignal"); 
		
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
					
					//Strip image data
					JSONObject imageData = objData.optJSONObject("image");
					String imgContent = null;
					String imgName = null;
					if (null != imageData) {
						objData.remove("image");
						imgName = imageData.optString("fileName");
						imgContent = imageData.optString("content");
					}
					
					//Transform JSON to dataobject to avoid fail
					DataObject obj = (DataObject) DataObject.parseJSON(objData.toString());					
					DataObject objNew = ds.addObj(obj);
					DataObject response = objNew.getDataObject("response");

					if (null != response && 0 == response.getInt("status")) {
						DataObject dlist = response.getDataObject("data");
						String oId = dlist.getId();
						
						if (oId.lastIndexOf(":") > 0) {
				            oId = oId.substring(oId.lastIndexOf(":") + 1);
				        }
						
						//Store image data
						if (null != imgName && null != imgContent) {
							String path = context.getRealPath("/") + "public/images/TourismSignal/" + oId;
							if (FSTUtils.FILE.storeBase64File(path, imgName, imgContent)) {
								String requestUrl = httpRequest.getScheme() +
									"://" + httpRequest.getServerName() + 
									(80 == httpRequest.getServerPort() ? "" : ":" + httpRequest.getServerPort());
								dlist.put("image", requestUrl + "/public/images/TourismSignal/" + oId + "/" + imgName);
								ds.updateObj(dlist);
							}
						}
						
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
