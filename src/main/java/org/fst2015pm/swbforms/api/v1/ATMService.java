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

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.semanticwb.datamanager.DataList;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

@Path ("/services/atm")
public class ATMService {
	@Context HttpServletRequest httpRequest;
	@Context ServletContext context;

	boolean useCookies = false;
	final static String ERROR_FORBIDDEN = "{\"error\":\"Unauthorized\"}";
	final static String ERROR_BADREQUEST = "{\"error\":\"Bad request\"}";
	PMCredentialsManager mgr;

	public ATMService() {
		//Create credentials manager
		mgr = new PMCredentialsManager();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getATMs(@Context UriInfo context) {
		HttpSession session = httpRequest.getSession();
		SWBScriptEngine engine = DataMgr.initPlatform("/WEB-INF/dbdatasources.js", session);

		if (!mgr.validateCredentials(httpRequest, useCookies, true)) {
			return Response.status(Status.FORBIDDEN).build();
		}
		SWBDataSource ds = engine.getDataSource("ATM");
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
			
			if (null != dlist && !dlist.isEmpty()) {
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
	public Response getATM(@PathParam("objId") String oId) {
		HttpSession session = httpRequest.getSession();
		SWBScriptEngine engine = DataMgr.initPlatform("/WEB-INF/dbdatasources.js", session);

		if (!mgr.validateCredentials(httpRequest, useCookies, true)) {
			return Response.status(Status.FORBIDDEN).build();
		}
		SWBDataSource ds = engine.getDataSource("ATM");
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
	public Response addATM(String content) throws IOException {
		HttpSession session = httpRequest.getSession();
		SWBScriptEngine engine = DataMgr.initPlatform("/WEB-INF/dbdatasources.js", session);
		SWBDataSource ds = engine.getDataSource("ATM");

		if (!mgr.validateCredentials(httpRequest, useCookies, true)) {
			return Response.status(Status.FORBIDDEN).build();
		}
		if (null == ds) return Response.status(Status.INTERNAL_SERVER_ERROR).build();

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
			return Response.ok(retArray.toString()).build();
		} catch (JSONException jspex) {
			return Response.status(Status.BAD_REQUEST).build();
		}
	}
}
