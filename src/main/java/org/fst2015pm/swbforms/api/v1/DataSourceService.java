package org.fst2015pm.swbforms.api.v1;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
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
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;

import org.apache.commons.io.FileUtils;
import org.fst2015pm.swbforms.utils.DBLogger;
import org.fst2015pm.swbforms.utils.FSTUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.semanticwb.datamanager.DataList;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;
import org.semanticwb.datamanager.script.ScriptObject;

import com.ibm.icu.text.SimpleDateFormat;

/**
 * REST service to manage datasources from inside app.
 **/
@Path("/datasources")
public class DataSourceService {
	@Context ServletContext context;
	@Context HttpServletRequest httpRequest;
	DBLogger logger = DBLogger.getInstance();

	SWBScriptEngine engine;
	PMCredentialsManager mgr = new PMCredentialsManager();;
	
	private enum AccessType { DISABLED, OPEN, APIKEY, SESSION };
	private final String restrictedDS = "DBDataSource|User|Role|PMLog|UserSession|ResetPasswordToken|APIKey|DSEndpoint|GeoLayer|Dashboard|Extractor";

	SimpleDateFormat sdf = new SimpleDateFormat("YYYY-MM-dd hh:mm:ss");
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDataSourceList(@Context UriInfo context) throws IOException {
		HttpSession session = httpRequest.getSession();
		engine = DataMgr.initPlatform("/WEB-INF/dbdatasources.js", session);
		SWBDataSource ds = engine.getDataSource("DBDataSource");
		
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
	@Path("/{dsname}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDataSourceObjects(@PathParam("dsname") String dataSourceId, @Context UriInfo info) {
		HttpSession session = httpRequest.getSession();
		MultivaluedMap<String, String> params = info.getQueryParameters();
		DataObject queryObj = new DataObject();
		
		//Init platform
		if (restrictedDS.contains(dataSourceId)) {
			engine = DataMgr.initPlatform(session);
		} else {
			engine = DataMgr.initPlatform("/WEB-INF/dbdatasources.js", session);
		}
		
		//Get DataSource
		SWBDataSource ds = engine.getDataSource(dataSourceId);
		if (null == ds) return Response.status(Status.NOT_FOUND).build();
		
		if (hasAccess(ds, httpRequest)) {
			//Get datasource fields
			boolean hasFields = false;
			HashMap<String, String> fieldNames = new HashMap<>();
			ScriptObject fieldsDef = ds.getDataSourceScript();
			hasFields = null != fieldsDef.get("fields");

			if (hasFields) {
				Iterator<ScriptObject> fields = fieldsDef.get("fields").values().iterator();
	            while(fields.hasNext()) {
	            	ScriptObject field = fields.next();
	            	fieldNames.put(field.getString("name"), field.getString("type"));
	            }
			}

            for (String key : params.keySet()) {
            	if (!hasFields) { //No fields defined, all passes
            		queryObj.put(key, params.getFirst(key));
            	} else if (null != fieldNames.get(key)) {
            		queryObj.put(key, params.getFirst(key));
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
		} else {
			return Response.status(Status.FORBIDDEN).build();
		}
	}

	@POST
	@Path("/{dsname}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response addDataSourceObject(@PathParam("dsname") String dataSourceId, String content) throws IOException {
		HttpSession session = httpRequest.getSession();
		
		if (restrictedDS.contains(dataSourceId)) {
			engine = DataMgr.initPlatform(session);
		} else {
			engine = DataMgr.initPlatform("/WEB-INF/dbdatasources.js", session);
		}
		
		//Get DataSource
		SWBDataSource ds = engine.getDataSource(dataSourceId);
		if (null == ds) return Response.status(Status.NOT_FOUND).build();
		
		if (hasAccess(false, true, httpRequest)) {
			DataObject usr = (DataObject) session.getAttribute("_USER_");
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
				obj.put("created", sdf.format(new Date()));

				if (validateObject(obj)) {
					DataObject objNew = ds.addObj(obj);
					DataObject response = objNew.getDataObject("response");
					if (null != response && 0 == response.getInt("status")) {
						objNew = processImages(ds, imgFields, response.getDataObject("data"));
					}
					logger.logActivity(usr.getString("fullname"), usr.getId(), false, "ADD", dataSourceId);
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
	public Response getDataSourceObject(@PathParam("dsname") String dataSourceId, @PathParam("objId") String oId) throws IOException {
		HttpSession session = httpRequest.getSession();
		
		if (restrictedDS.contains(dataSourceId)) {
			engine = DataMgr.initPlatform(session);
		} else {
			engine = DataMgr.initPlatform("/WEB-INF/dbdatasources.js", session);
		}
		
		//Get DataSource
		SWBDataSource ds = engine.getDataSource(dataSourceId);
		if (null == ds) return Response.status(Status.NOT_FOUND).build();

		if (hasAccess(ds, httpRequest)) {
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
	public Response updateDataSourceObject(@PathParam("dsname") String dataSourceId, @PathParam("objId") String oId, String content) throws IOException {
		HttpSession session = httpRequest.getSession();
		if (restrictedDS.contains(dataSourceId)) {
			engine = DataMgr.initPlatform(session);
		} else {
			engine = DataMgr.initPlatform("/WEB-INF/dbdatasources.js", session);
		}
		
		//Get DataSource
		SWBDataSource ds = engine.getDataSource(dataSourceId);
		if (null == ds) return Response.status(Status.NOT_FOUND).build();
		
		if (hasAccess(false, true, httpRequest)) {
			DataObject usr = (DataObject) session.getAttribute("_USER_");
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
					logger.logActivity(usr.getString("fullname"), usr.getId(), false, "EDIT", dataSourceId);
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
	public Response removeDataSourceObject(@PathParam("dsname") String dataSourceId, @PathParam("objId") String oId) throws IOException {
		HttpSession session = httpRequest.getSession();
		if (restrictedDS.contains(dataSourceId)) {
			engine = DataMgr.initPlatform(session);
		} else {
			engine = DataMgr.initPlatform("/WEB-INF/dbdatasources.js", session);
		}

		//TODO: Remove associated images
		//Get DataSource
		SWBDataSource ds = engine.getDataSource(dataSourceId);
		if (null == ds) return Response.status(Status.NOT_FOUND).build();
		
		if (hasAccess(false, true, httpRequest)) {
			DataObject usr = (DataObject) session.getAttribute("_USER_");
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
			logger.logActivity(usr.getString("fullname"), usr.getId(), false, "DELETE", dataSourceId);
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
	
	private boolean isSecureDataSource(SWBDataSource ds) {
		ScriptObject dsourceDef = ds.getDataSourceScript();
		return (null != ds && null != dsourceDef && Boolean.valueOf(dsourceDef.getString("secure")));
	}
	
	private boolean hasAccess(SWBDataSource ds, HttpServletRequest request) {
		//Check if it is secured and enable checksession flag
		boolean cs = false;
		boolean ca = false;
		boolean hasAccess = false;
		
		if (isSecureDataSource(ds)) {
			cs = true;
		} else {
			AccessType at = getDSAPIAccessType(ds.getName());
			
			switch (at) {
				case DISABLED: {
					return false;
				}
				case OPEN: {
					hasAccess = true;
					break;
				}
				case SESSION: {
					cs = true;
					ca = false;
					break;
				}
				case APIKEY: {
					cs = false;
					ca = true;
					break;
				}
			};
		}
		
		if (!hasAccess) {
			hasAccess = hasAccess(ca, cs, request);
		}
		
		return hasAccess;
	}
	
	private boolean hasAccess(boolean checkAPIKey, boolean checkSession, HttpServletRequest request) {
		boolean ret = false;
		if (checkSession) {
			if (null != request.getSession().getAttribute("_USER_")) {//TODO: Check also user in DB
				ret = true;
			}
		} else if (checkAPIKey) {
			ret = mgr.validateCredentials(request, false, true);
		} else {
			return true;
		}
		
		return ret;
	}
	
	private AccessType getDSAPIAccessType(String dsName) {
		//Find datasource in DSEndpoint configurations and return restriction type
		engine = DataMgr.initPlatform(null);
		
		SWBDataSource ds = engine.getDataSource("DSEndpoint");
		DataObject dsFetch = null;
		DataList dlist = null;

		try {
			DataObject wrapper = new DataObject();
			DataObject q = new DataObject();
			q.put("dataSourceName", dsName);
			wrapper.put("data", q);
			dsFetch = ds.fetch(wrapper);

			if (null != dsFetch) {
				DataObject response = dsFetch.getDataObject("response");
				if (null != response) {					
					dlist = response.getDataList("data");
					if (!dlist.isEmpty()) {
						DataObject dse = dlist.getDataObject(0);
						if (dse.getBoolean("enabled", false) == false) {
							return AccessType.DISABLED;
						}
						
						String at = dse.getString("restrictionType");
						switch (at) {
							case "OPEN": {
								return AccessType.OPEN;
							}
							case "APIKEY": {
								return AccessType.APIKEY;
							}
							case "SESSION": {
								return AccessType.SESSION;
							}
						}
					}
				}
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		
		return AccessType.DISABLED;
	}

	private boolean validateObject(DataObject obj) {
		// TODO: validate object before insert
		return true;
	}
}
