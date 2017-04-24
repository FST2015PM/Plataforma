package org.fst2015pm.swbforms.api.v1;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

import javax.servlet.ServletContext;
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
import javax.ws.rs.core.Response.Status;

import org.apache.commons.io.FileUtils;
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
	@Context ServletContext context;
	@Context HttpServletRequest httpRequest;
	
	SWBScriptEngine engine;
	boolean checkSession = false;

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDataSourceList() throws IOException {
		HttpSession session = httpRequest.getSession();
		engine = DataMgr.initPlatform("/WEB-INF/dbdatasources.js", session);

		if (null != session.getAttribute("_USER_")) {
			Set<String> dataSources = engine.getDataSourceNames();
			JSONArray ret;

			try {
				ret = new JSONArray();
				for (String name : dataSources) {
					SWBDataSource dsource = engine.getDataSource(name);
					ScriptObject dsourceDef = dsource.getDataSourceScript();
					
					if (null != dsource && null != dsourceDef && !Boolean.valueOf(dsourceDef.getString("secure"))) {
						//JSONObject ds = new JSONObject();
						//ds.put("name", name);
						//ret.put(ds);
						ret.put(name);
					}
				}
			} catch (JSONException jsex) {
				return Response.status(Status.INTERNAL_SERVER_ERROR).build();
			}

			return Response.ok().entity(ret.toString()).build();
		}

		return Response.status(Status.FORBIDDEN).build();
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
			engine = DataMgr.initPlatform("/WEB-INF/dbdatasources.js", session);
		}

		if (!checkSession || (checkSession && null != session.getAttribute("_USER_"))) {
			SWBDataSource ds = engine.getDataSource(dataSourceId);
			if (null == ds) return Response.status(Status.BAD_REQUEST).build();

			//Get datasource fields
			HashMap<String, String> dsFields = new HashMap<>();
			ScriptObject fieldsDef = ds.getDataSourceScript().get("fields");

			if (null != fieldsDef) {
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
				return Response.ok().entity(dsFetch.getDataObject("response")).build();
			} else {
				return Response.status(Status.INTERNAL_SERVER_ERROR).build();
			}
		}

		return Response.status(Status.FORBIDDEN).entity("forbidden").build();
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
			engine = DataMgr.initPlatform("/WEB-INF/dbdatasources.js", session);
		}

		if (!checkSession || (checkSession && null != session.getAttribute("_USER_"))) {
			SWBDataSource ds = engine.getDataSource(dataSourceId);
			if (null == ds) return Response.status(Status.BAD_REQUEST).build();

			JSONObject objData = null;
			HashMap<String, JSONObject> imgFields = new HashMap<>();
			try {
				objData = new JSONObject(content);
				
				//Check fields in search of image | photo | picture
				String keys [] = JSONObject.getNames(objData);
				for (String key : keys) {
					if ("image".equalsIgnoreCase(key) || "picture".equalsIgnoreCase(key) || "photo".equalsIgnoreCase(key)) {
						Object job = objData.get(key);
						if (job instanceof JSONObject) {
							JSONObject jjob = (JSONObject) job;
							//Fields must be objects with name and content fields, otherwise treat as strings
							if (jjob.has("fileName") && jjob.has("content")) {
								imgFields.put(key, jjob);
								objData.remove(key);
							}
						}
					}
				}
			} catch (JSONException jspex) {
				return Response.status(Status.INTERNAL_SERVER_ERROR).build();
			}

			if (null != objData) {
				objData.remove("_id");
				//Transform JSON to dataobject to avoid fail
				DataObject obj = (DataObject) DataObject.parseJSON(content);

				if (validateObject(obj)) {
					DataObject objNew = ds.addObj(obj);
					DataObject response = objNew.getDataObject("response");
					if (null != response && 0 == response.getInt("status")) {
						objNew = processImages(ds, imgFields, response.getDataObject("data"));
					}
					return Response.ok().entity(objNew.getDataObject("response")).build();
				} else {
					return Response.status(Status.BAD_REQUEST).build();
				}
			}
		}

		return Response.status(Status.FORBIDDEN).build();
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
			engine = DataMgr.initPlatform("/WEB-INF/dbdatasources.js", session);
		}

		if (!checkSession || (checkSession && null != session.getAttribute("_USER_"))) {
			SWBDataSource ds = engine.getDataSource(dataSourceId);

			if (null == ds) return Response.status(Status.BAD_REQUEST).build();
			DataObject dsFetch = ds.fetchObjById(oId);
			if (null == dsFetch)
				return Response.status(Status.BAD_REQUEST).build();

			return Response.ok().entity(dsFetch).build();
		}

		return Response.status(Status.FORBIDDEN).build();
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
			engine = DataMgr.initPlatform("/WEB-INF/dbdatasources.js", session);
		}

		if (!checkSession || (checkSession && null != session.getAttribute("_USER_"))) {
			SWBDataSource ds = engine.getDataSource(dataSourceId);
            DataObject updateObj = null;

			if (null == ds) return Response.status(Status.FORBIDDEN).build();

			JSONObject objData = null;
			HashMap<String, JSONObject> imgFields = new HashMap<>();
			try {
				objData = new JSONObject(content);
				
				//Check fields in search of image | photo | picture
				String keys [] = JSONObject.getNames(objData);
				for (String key : keys) {
					if ("image".equalsIgnoreCase(key) || "picture".equalsIgnoreCase(key) || "photo".equalsIgnoreCase(key)) {
						Object job = objData.get(key);
						if (job instanceof JSONObject) {
							JSONObject jjob = (JSONObject) job;
							//Fields must be objects with name and content fields, otherwise treat as strings
							if (jjob.has("fileName") && jjob.has("content")) {
								imgFields.put(key, jjob);
								objData.remove(key);
							}
						}
					}
				}
			} catch (JSONException jspex) {
				return Response.status(Status.INTERNAL_SERVER_ERROR).build();
			}

			if (null != objData) {
				//Transform JSON to dataobject to avoid fail
				DataObject obj = (DataObject) DataObject.parseJSON(content);

				if (validateObject(obj)) {
					DataObject objNew = ds.updateObj(obj);
					DataObject response = objNew.getDataObject("response");
					if (null != response && 0 == response.getInt("status")) {
						objNew = processImages(ds, imgFields, response.getDataObject("data"));
					}
					return Response.ok().entity(objNew.getDataObject("response")).build();
				} else {
					return Response.status(Status.BAD_REQUEST).build();
				}
			}
		}

		return Response.status(Status.FORBIDDEN).build();
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
			engine = DataMgr.initPlatform("/WEB-INF/dbdatasources.js", session);
		}

		//TODO: Remove associated images
		if (!checkSession || (checkSession && null != session.getAttribute("_USER_"))) {
			SWBDataSource ds = engine.getDataSource(dataSourceId);

			if (null == ds) return Response.status(Status.BAD_REQUEST).build();
			DataObject obj = ds.fetchObjById(oId);
			if (null == obj) return Response.status(Status.BAD_REQUEST).build();
			
			ArrayList<String> imgFields = new ArrayList<>();
			for (String key : obj.keySet()) {
				if ("image".equalsIgnoreCase(key) || "picture".equalsIgnoreCase(key) || "photo".equalsIgnoreCase(key)) {
					String imgUrl = obj.getString(key);
					if (null != imgUrl && !imgUrl.isEmpty()) {
						imgFields.add(imgUrl);
					}
				}
			}
			DataObject ret = ds.removeObj(obj);
			DataObject response = ret.getDataObject("response");
			if (null != ret && 0 == response.getInt("status")) { //TODO: Define a better mechanism to remove images, similar URL items could collide
				for (String img : imgFields) {
					String fName = context.getRealPath("/") + "public/images/"+ ds.getName() +"/" + img.substring(img.lastIndexOf("/") + 1, img.length());
					FileUtils.deleteQuietly(new File(fName));
				}
			}
			return Response.ok().entity(ret).build();
		}

		return Response.status(Status.FORBIDDEN).build();
	}
	
	private DataObject processImages(SWBDataSource ds, HashMap<String, JSONObject> imgFields, DataObject dob) {
		String oId = dob.getId();
		if (oId.lastIndexOf(":") > 0) {
            oId = oId.substring(oId.lastIndexOf(":") + 1);
        }
		String destPath = context.getRealPath("/") + "public/images/"+ ds.getName() +"/";
		String requestUrl = ("production".equals(FSTUtils.getEnvConfig()) ? "https" : httpRequest.getScheme()) +
				"://" + httpRequest.getServerName() +
				(80 == httpRequest.getServerPort() ? "" : ":" + httpRequest.getServerPort()) +
				"/public/images/"+ ds.getName() +"/";
		
		HashMap<String, String> fields = new HashMap<>();
		for (String key : imgFields.keySet()) {
			JSONObject imgObj = imgFields.get(key);
			String imgName = imgObj.getString("fileName").replaceAll("[/\\\\]+", "");
			
			if (imgName.lastIndexOf(".") > -1) {
				imgName = oId + imgName.substring(imgName.lastIndexOf("."), imgName.length());
				if (FSTUtils.FILE.storeBase64File(destPath, imgName, imgObj.getString("content"))) {
					fields.put(key, requestUrl + imgName);
				}
			}
		}
		
		for (String key : fields.keySet()) {
			dob.put(key, fields.get(key));
		}
		
		try {
			return ds.updateObj(dob);
		} catch (IOException ioex) {
			ioex.printStackTrace();
			return null;
		}
	}

	private boolean validateObject(DataObject obj) {
		// TODO: validate object before insert
		return true;
	}
}
