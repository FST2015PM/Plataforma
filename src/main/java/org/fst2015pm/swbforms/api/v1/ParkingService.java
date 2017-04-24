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
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.core.Response.Status;

import org.fst2015pm.swbforms.utils.FSTUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.semanticwb.datamanager.DataList;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

@Path("/services/parking")
public class ParkingService {
	@Context HttpServletRequest httpRequest;
	@Context ServletContext context;

	boolean useCookies = false;
	final static String ERROR_FORBIDDEN = "{\"error\":\"Unauthorized\"}";
	final static String ERROR_BADREQUEST = "{\"error\":\"Bad request\"}";
	PMCredentialsManager mgr;

	public ParkingService() {
		//Create credentials manager
		mgr = new PMCredentialsManager();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getParkingList(@Context UriInfo context) {
		HttpSession session = httpRequest.getSession();
		SWBScriptEngine engine = DataMgr.initPlatform("/WEB-INF/dbdatasources.js", session);

		if (!mgr.validateCredentials(httpRequest, useCookies, true)) {
			return Response.status(401).entity(ERROR_FORBIDDEN).build();
		}
		
		SWBDataSource ds = engine.getDataSource("Parking");
		DataObject dsFetch = null;
		DataList dlist = null;

		try {
			DataObject wrapper = new DataObject();
			DataObject q = new DataObject();
			MultivaluedMap<String, String> params = context.getQueryParameters();
			for (String key : params.keySet()) {
				q.put(key, params.getFirst(key));
			}

			wrapper.put("data", q);
			dsFetch = ds.fetch(wrapper);

			if (null != dsFetch) {
				DataObject response = dsFetch.getDataObject("response");
				if (null != response) {
					dlist = response.getDataList("data");
				}
			}
			
			if (!dlist.isEmpty()) {
				return Response.ok(dlist).build();
			} else {
				return Response.ok("[]").build();
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}
	}

	@GET
	@Path("/{objId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getParking(@PathParam("objId") String oId) {
		HttpSession session = httpRequest.getSession();
		SWBScriptEngine engine = DataMgr.initPlatform("/WEB-INF/dbdatasources.js", session);

		if (!mgr.validateCredentials(httpRequest, useCookies, true)) {
			return Response.status(401).entity(ERROR_FORBIDDEN).build();
		}
		SWBDataSource ds = engine.getDataSource("Parking");
		DataObject dsFetch = null;

		try {
			dsFetch = ds.fetchObjById(oId);

			if (null != dsFetch) {
				return Response.ok(dsFetch).build();
			} else {
				return Response.status(Status.NOT_FOUND).build();
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response addParking(String content) throws IOException {
		HttpSession session = httpRequest.getSession();
		SWBScriptEngine engine = DataMgr.initPlatform("/WEB-INF/dbdatasources.js", session);
		SWBDataSource ds = engine.getDataSource("Parking");

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
							imgName = imgName.replaceAll("[/\\\\]+", "");
							String path = context.getRealPath("/") + "public/images/Parking/" + oId;
							if (FSTUtils.FILE.storeBase64File(path, imgName, imgContent)) {
								String requestUrl = ("production".equals(FSTUtils.getEnvConfig()) ? "https" : httpRequest.getScheme()) +
										"://" + httpRequest.getServerName() +
										(80 == httpRequest.getServerPort() ? "" : ":" + httpRequest.getServerPort());
								
								dlist.put("image", requestUrl + "/public/images/Parking/" + oId + "/" + imgName);
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
