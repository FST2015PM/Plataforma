package org.fst2015pm.swbforms.api.v1;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import org.fst2015pm.swbforms.utils.FSTUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;
import org.semanticwb.datamanager.script.ScriptObject;

/**
 * REST service to manage datasources from inside app.
 **/
@Path("/datasources")
public class DataSourceService {
	SWBScriptEngine engine;
	
	@Context
	HttpServletRequest httpRequest;
	boolean checkSession = false;
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDataSourceList() throws IOException {
		HttpSession session = httpRequest.getSession();
		engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);

		if (null != session.getAttribute("_USER_")) {
			Set<String> dataSources = engine.getDataSourceNames();
			JSONArray ret;

			try {
				ret = new JSONArray();
				for (String name : dataSources) {
					JSONObject ds = new JSONObject();
					ds.put("name", name);
					ret.put(ds);
				}
			} catch (JSONException jsex) {
				return Response.status(500).build();
			}

			return Response.status(200).entity(ret.toString()).build();
		}

		return Response.status(403).entity("forbidden").build();
	}

	@GET
	@Path("/{dsname}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDataSourceObjects(@PathParam("dsname") String dataSourceId, @Context UriInfo info) {
		HttpSession session = httpRequest.getSession();
		MultivaluedMap<String, String> params = info.getQueryParameters();
		DataObject queryObj = new DataObject();
		
		//Init SWBForms engine
		if ("User".equals(dataSourceId)) {
			engine = DataMgr.initPlatform(session);
		} else {
			engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
		}

		if (!checkSession || (checkSession && null != session.getAttribute("_USER_"))) {
			SWBDataSource ds = engine.getDataSource(dataSourceId);
			if (null == ds) return Response.status(400).build();
			
			//Get datasource fields
			HashMap<String, String> dsFields = new HashMap<>();
			ScriptObject fieldsDef = ds.getDataSourceScript().get("fields");
			Iterator<ScriptObject> itFields = fieldsDef.values().iterator();
			while (itFields.hasNext()) {
				ScriptObject col = itFields.next();
				dsFields.put(col.getString("name"), col.getString("type"));
			}
			
			//Build query object
			for (String key : params.keySet()) {
				String type = dsFields.get(key); 
				if (null != type) {
					Object typed = FSTUtils.DATA.inferTypedValue(params.getFirst(key));//FSTUtils.DATA.getTypedObject(params.getFirst(key), type);
					if (null != typed) {
						queryObj.put(key, typed);
					}
				}
			}

			//Execute fetch query
			DataObject dsFetch = null;
			try {
				DataObject wrapper = new DataObject();
				wrapper.put("data", queryObj);
				dsFetch = ds.fetch(wrapper);
			} catch (IOException ioex) {
				ioex.printStackTrace();
			}

			if (null != dsFetch) {
				return Response.status(200).entity(dsFetch.getDataObject("response")).build();
			} else {
				return Response.status(500).build();
			}
		}

		return Response.status(403).entity("forbidden").build();
	}

	@POST
	@Path("/{dsname}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response addDataSourceObject(@PathParam("dsname") String dataSourceId, String content) throws IOException {
		HttpSession session = httpRequest.getSession();
		if ("User".equals(dataSourceId)) {
			engine = DataMgr.initPlatform(session);
		} else {
			engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
		}

		if (!checkSession || (checkSession && null != session.getAttribute("_USER_"))) {
			SWBDataSource ds = engine.getDataSource(dataSourceId);
			if (null == ds) return Response.status(400).build();
			
			JSONObject objData = null;
			try {
				objData = new JSONObject(content);
			} catch (JSONException jspex) {
				return Response.status(500).build();
			}
			
			if (null != objData) {
				objData.remove("_id");
				//Transform JSON to dataobject to avoid fail
				DataObject obj = (DataObject) DataObject.parseJSON(content);

				if (validateObject(obj)) {
					DataObject objNew = ds.addObj(obj);
					return Response.ok(objNew.getDataObject("response")).status(200).build();
				} else {
					return Response.status(400).build();
				}
			}
		}

		return Response.status(403).entity("forbidden").build();
	}

	@GET
	@Path("/{dsname}/{objId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDataSourceObject(@PathParam("dsname") String dataSourceId, @PathParam("objId") String oId)
			throws IOException {
		HttpSession session = httpRequest.getSession();
		if ("User".equals(dataSourceId)) {
			engine = DataMgr.initPlatform(session);
		} else {
			engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
		}

		if (!checkSession || (checkSession && null != session.getAttribute("_USER_"))) {
			SWBDataSource ds = engine.getDataSource(dataSourceId);

			if (null == ds) return Response.status(400).build();
			DataObject dsFetch = ds.fetchObjById(oId);
			if (null == dsFetch)
				return Response.status(400).build();

			return Response.status(200).entity(dsFetch).build();
		}

		return Response.status(403).entity("forbidden").build();
	}

	@PUT
	@Path("/{dsname}/{objId}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response updateDataSourceObject(@PathParam("dsname") String dataSourceId, @PathParam("objId") String oId,
			String content) throws IOException {
		HttpSession session = httpRequest.getSession();
		if ("User".equals(dataSourceId)) {
			engine = DataMgr.initPlatform(session);
		} else {
			engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
		}

		if (!checkSession || (checkSession && null != session.getAttribute("_USER_"))) {
			SWBDataSource ds = engine.getDataSource(dataSourceId);
            DataObject updateObj = null;
            
			if (null == ds) return Response.status(400).build();
			
			JSONObject objData = null;
			try {
				objData = new JSONObject(content);
			} catch (JSONException jspex) {
				return Response.status(500).build();
			}
			
			if (null != objData) {
				//Transform JSON to dataobject to avoid fail
				DataObject obj = (DataObject) DataObject.parseJSON(content);

				if (validateObject(obj)) {
					updateObj = ds.updateObj(obj);
					//DataObject objNew = ds.addObj(obj);
					return Response.ok(updateObj).status(200).build();
				} else {
					return Response.status(400).build();
				}
			}
		}

		return Response.status(403).entity("forbidden").build();
	}

	@DELETE
	@Path("/{dsname}/{objId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response removeDataSourceObject(@PathParam("dsname") String dataSourceId, @PathParam("objId") String oId)
			throws IOException {
		HttpSession session = httpRequest.getSession();
		if ("User".equals(dataSourceId)) {
			engine = DataMgr.initPlatform(session);
		} else {
			engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
		}

		if (!checkSession || (checkSession && null != session.getAttribute("_USER_"))) {
			SWBDataSource ds = engine.getDataSource(dataSourceId);

			if (null == ds) return Response.status(400).build();
			DataObject obj = ds.fetchObjById(oId);
			if (null == obj)
				return Response.status(400).build();
			DataObject ret = ds.removeObj(obj);

			return Response.status(200).entity(ret).build();
		}

		return Response.status(403).entity("forbidden").build();
	}

	private boolean validateObject(DataObject obj) {
		// TODO: validate object before insert
		return true;
	}
        
	/*@GET
	@Path("/{dsname}/{prop}/{objId}")
	@Produces("application/json")
	public Response getListObjectByProperty(@PathParam("dsname") String dataSourceId, @PathParam("prop") String prop,  @PathParam("objId") String oId)
			throws IOException {
		HttpSession session = httpRequest.getSession();
		if ("User".equals(dataSourceId)) {
			engine = DataMgr.initPlatform(session);
		} else {
			engine = DataMgr.initPlatform("/app/js/datasources/datasources.js", session);
		}

		if (!checkSession || (checkSession && null != session.getAttribute("_USER_"))) {
			SWBDataSource ds = engine.getDataSource(dataSourceId);

			if (null == ds) return Response.status(400).build();
                        DataObject query = new DataObject();
                        query.addSubObject("data").addParam(prop, oId);
			DataObject dsFetch = ds.fetch(query);
			if (null == dsFetch)
				return Response.status(400).build();

			return Response.status(200).entity(dsFetch).build();
		}

		return Response.status(403).entity("forbidden").build();
	} */
}
