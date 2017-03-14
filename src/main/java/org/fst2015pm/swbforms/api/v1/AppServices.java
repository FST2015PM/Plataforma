package org.fst2015pm.swbforms.api.v1;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Date;
import java.util.UUID;

import javax.servlet.ServletContext;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;

import org.apache.commons.io.IOUtils;
import org.fst2015pm.swbforms.utils.FSTUtils;
import org.fst2015pm.swbforms.utils.SimpleMailSender;
import org.json.JSONException;
import org.json.JSONObject;
import org.semanticwb.datamanager.DataList;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.DataUtils;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;
import org.semanticwb.datamanager.SWBScriptUtils;
import org.semanticwb.datamanager.script.ScriptObject;

/**
 * REST endpoint for app services
 * @author Hasdai Pacheco
 */
@Path("/services")
public class AppServices {
	private int expireMinutes = 30;
	SWBScriptEngine engine;
	SWBScriptUtils utils;
	@Context HttpServletRequest httpRequest;
	private boolean useCookies = false;
	private final static String ERROR_FORBIDDEN = "{\"error\":\"Unauthorized\"}";
	private final static String ERROR_BADREQUEST = "{\"error\":\"Bad request\"}";
	
	@POST
	@Path("/apikey")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addApiKey(String content) throws IOException {
		HttpSession session = httpRequest.getSession();
		DataObject res = new DataObject();
		Response ret;
		
		if (null == session.getAttribute("_USER_")) {
			ret = Response.status(403).build();
		} else {
			//Init platform with global configuration
			engine = DataMgr.initPlatform(session);
			
			//Get request body
			DataObject objData = null;
			try {
				JSONObject payload = new JSONObject(content);
				objData = new DataObject();
				
				if (!payload.optString("appName").isEmpty()) {
					objData.put("appName", payload.getString("appName"));
					//objData.put("enabled", payload.optBoolean("enabled"));
				}
			} catch (JSONException jspex) {
				ret = Response.status(400).entity(ERROR_BADREQUEST).build();
			}
			
			if (null == objData) {
				ret = Response.status(400).entity(ERROR_BADREQUEST).build();
			} else {
				//Generate app Key and Secret
				String apiKey = FSTUtils.API.generateAPIKey();
				String apiSecret = FSTUtils.API.generateAPIKey();
				 
				objData.put("appKey", apiKey);
				objData.put("appSecret", apiSecret);
				
				//Add api key object
				SWBDataSource ds = engine.getDataSource("APIKey");
				ds.addObj(objData);//TODO: Check errors from SWBForms API
				
				//Build response
				res.put("key", apiKey);
				res.put("secret", apiSecret);
				ret = Response.status(200).entity(res).build();
			}
		}
		
		return ret;
	}
	
	/**
	 * Creates a session token for a user
	 * @param content request body
	 * @return Status code 200 with user data in request body on success
	 * @throws IOException
	 */
	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response loginUser(@Context HttpHeaders headers, String content) throws IOException {
		DataObject res = new DataObject();
		boolean create = false;
		Response ret;
		
		//Check auth headers
		String authorization = getAuthCredentials(httpRequest, useCookies);
		if (null == authorization || authorization.isEmpty()) {
			return Response.status(401).entity(ERROR_FORBIDDEN).build();
		}
		
		//Check API Key
		if (!isAPIKeyValid(authorization)) {
			return Response.status(401).entity(ERROR_FORBIDDEN).build();
		}
		
		//Init platform with global configuration
		engine = DataMgr.initPlatform(null);
		
		ScriptObject usrSessionTime = engine.getScriptObject().get("userSessionTime");
		if (null != usrSessionTime) {
			expireMinutes = (Integer) usrSessionTime.getValue();
		}
		
		
		//Exit on empty request body
		if (null == content || content.isEmpty()) return Response.status(400).entity(ERROR_BADREQUEST).build();
		
		//Get request body and fail on parse
		JSONObject objData = null;
		try {
			objData = new JSONObject(content);
		} catch (JSONException jspex) {
			ret = Response.status(400).entity(ERROR_BADREQUEST).build();
			return ret;
		}
		
		//Find user in User datasource
		DataObject user = findUser(engine.getDataSource("User"), objData.optString("email"), objData.optString("password")); 
		if (null == user) {
			ret = Response.status(403).entity(ERROR_FORBIDDEN).build();
			return ret;
		}
		
		//Find user session
		SWBDataSource ds = engine.getDataSource("UserSession");
		String token = UUID.randomUUID().toString().replace("-", "");
		String userId = user.getId();
		DataObject sessData = getUserSessionObject(ds, userId);
		
		//Save new session token
		if (null == sessData) {
			create = true;
			sessData = new DataObject();
			sessData.put("user", userId);
		}
		sessData.put("token", token);
		
		//Get session time from config
		SWBScriptEngine usereng = DataMgr.initPlatform("/app/js/datasources/datasources.js", null);
		ScriptObject so = usereng.getScriptObject();
		if (null != so && null != so.get("userSessionConfig")) {
			expireMinutes = so.get("userSessionConfig").getInt("sessTime");
		}
		
		sessData.put("expiration", new Date().getTime() + (1000 * 60 * expireMinutes));
		
		//Update session object
		if (create) {
			ds.addObj(sessData);
		} else {
			ds.updateObj(sessData);
		}
		
		//Build response
		DataObject respSessData = new DataObject();
		respSessData.put("sessionId", "APPSESSIONID");
		respSessData.put("value", token);
		
		DataObject respUserData = new DataObject();
		respUserData.put("fullname", user.getString("fullname"));
		respUserData.put("email", user.getString("email"));
		if (null != user.getString("magictown") && !user.getString("magictown").isEmpty()) {
			respUserData.put("magictown", user.getString("magictown"));
		}
		
		res.put("user", respUserData);
		res.put("session", respSessData);
		
		if (useCookies) {
			ret = Response.status(200).entity(res).cookie(new NewCookie("APPSESSIONID", token, null, null, null, (60 * expireMinutes), false, true)).build();
		} else {
			ret = Response.status(200).entity(res).build();
		}
		
		return ret;
	}
	
	/**
	 * Destroys a user session
	 * @return Status code 200 on success
	 * @throws IOException
	 */
	@POST
	@Path("/logout")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response logoutUser(@Context HttpHeaders headers) throws IOException {
		DataObject res = new DataObject();
		
		//Check auth headers
		String authorization = getAuthCredentials(httpRequest, useCookies);
		if (null == authorization || authorization.isEmpty()) {
			return Response.status(401).entity(ERROR_FORBIDDEN).build();
		}
		
		//Check API Key
		String [] parts = authorization.split(":");
		if (parts.length != 2 || !isAPIKeyValid(parts[0])) {
			return Response.status(401).entity(ERROR_FORBIDDEN).build();
		}
		
		//Init platform with global configuration
		engine = DataMgr.initPlatform(null);
		
		//Find user session
		SWBDataSource ds = engine.getDataSource("UserSession");
		DataObject sess = getUserSessionObjectByToken(ds, parts[1]);
		
		//Remove session
		if (null != sess) {
			ds.removeObj(sess);
		} else {
			return Response.status(400).entity(ERROR_BADREQUEST).build();
		}
		
		if (useCookies) {
			return Response.status(200).cookie(new NewCookie("APPSESSIONID", null, null, null, null, 0, false, true)).build();
		} else {
			return Response.status(200).build();
		}
	}
	
	/**
	 * Resets user password
	 * @return Status code 200 on success
	 * @throws IOException
	 */
	@POST
	@Path("/resetpassword")
	@Produces(MediaType.APPLICATION_JSON)
	public Response resetUserPassword(@Context HttpHeaders headers, @Context ServletContext context) throws IOException {
		boolean create = false;
		
		//Check auth headers
		String authorization = getAuthCredentials(httpRequest, useCookies);
		if (null == authorization || authorization.isEmpty()) {
			return Response.status(401).entity(ERROR_FORBIDDEN).build();
		}
		
		//Check API Key
		String [] parts = authorization.split(":");
		if (parts.length != 2 || !isAPIKeyValid(parts[0])) {
			return Response.status(401).entity(ERROR_FORBIDDEN).build();
		}
		
		//Init platform with global options
		engine = DataMgr.initPlatform(null);
		utils = new SWBScriptUtils(engine);
		
		//Prepare datasources
		SWBDataSource ds = engine.getDataSource("UserSession");
		SWBDataSource users = engine.getDataSource("User");
		SWBDataSource resetTokens = engine.getDataSource("ResetPasswordToken");
		
		//Get session object
		DataObject sess = getUserSessionObjectByToken(ds, parts[1]);
		
		if (isSessionActive(engine, sess)) {
			//Find user and get email
			String userID = sess.getString("user");
			DataObject user = users.fetchObjById(userID);
			String email = user.getString("email");
	
			//Check if previous token exists
			DataObject queryObj = new DataObject();
			queryObj.put("user", userID);
			
			DataObject dsFetch = null;
			if (null != resetTokens) {
				try {
					DataObject wrapper = new DataObject();
					wrapper.put("data", queryObj);
					dsFetch = resetTokens.fetch(wrapper);
				} catch (IOException ioex) {
					ioex.printStackTrace();
				}
			}
			
			//Add token to datasource with expiration of 1 day
			if (null == dsFetch || null != dsFetch.getDataObject("response")) {
				dsFetch = new DataObject();
				dsFetch.put("user", userID);
				create = true;
			} else {
				dsFetch = dsFetch.getDataObject("response");
			}
			
			String resetToken = UUID.randomUUID().toString().replace("-", "");
			dsFetch.put("token", resetToken);
			dsFetch.put("expiration", new Date().getTime() + (1000 * 60 * 60 * 24));
			
			if (create) {
				resetTokens.addObj(dsFetch);
			} else {
				resetTokens.updateObj(dsFetch);
			}
			
			//Send mail with reset link
			String template = null;
			FileInputStream inputStream = new FileInputStream(context.getRealPath("/")+"work/config/resetPasswordMailTemplate.html");
			try {
			    template = IOUtils.toString(inputStream, "UTF-8");
			} finally {
			    inputStream.close();
			}
			
			if (null != template) {
				template = template.replace("___RESETTOKEN___", resetToken);
				SimpleMailSender.getInstance().sendHTMLMail("no-reply@miit.mx", email, "Solicitud de cambio de contraseña", template);
			}
			
			//Invalidate current session
			ds.removeObj(sess);
		} else {
			return Response.status(401).entity(ERROR_FORBIDDEN).build();
		}
		
		return Response.status(200).build();
	}
	
	/**
	 * Gets user session token from authorization headers or session cookie
	 * @param request Request object
	 * @param checkCookies whether to check session cookie
	 * @return
	 */
	private String getAuthCredentials(HttpServletRequest request, boolean checkCookies) {
		//Find session token in authorization headers
		String ret = request.getHeader("authorization"); 
		if (null != ret) {
			ret = ret.replace("Basic ", "");
		} else if (checkCookies && null != request.getCookies()) {
			Cookie cookies [] = request.getCookies();
			for (Cookie c : cookies) {
				if ("APPSESSIONID".equals(c.getName()) && !c.getValue().isEmpty()) {
					//TODO: check cookie maxAge or check session expiration time to invalid cookie
					ret = c.getValue();
				}
			}
		}
		
		return ret;
	}
	
	/**
	 * Checks whether a session is still active
	 * @param sessObject Session object
	 * @return
	 */
	private boolean isSessionActive(SWBScriptEngine engine, DataObject sessObject) {		
		if (null != sessObject) {
			//Check validity
			long now = new Date().getTime();
			long sessExp =  sessObject.getLong("expiration");
			
			if (now < sessExp) {
				return true;
			}
			
			//Remove session object if expired
			SWBDataSource sessions = engine.getDataSource("UserSession");
			try {
				sessions.removeObj(sessObject);
			} catch(IOException ioex) {
				ioex.printStackTrace();
			}
		}
		
		return false;
	}
	
	/**
	 * Gets user session object by provided token
	 * @param sesDS UserSession DataSource
	 * @param token User token
	 * @return User session object matching provided token or null
	 */
	private DataObject getUserSessionObjectByToken(SWBDataSource sesDS, String token) {
		DataObject ret = null;
		DataObject queryObj = new DataObject();
		
		queryObj.put("token", token);
		
		DataObject dsFetch = null;
		if (null != sesDS) {
			try {
				DataObject wrapper = new DataObject();
				wrapper.put("data", queryObj);
				dsFetch = sesDS.fetch(wrapper);
			} catch (IOException ioex) {
				ioex.printStackTrace();
			}
		}
		
		if (null != dsFetch) {
			DataObject response = dsFetch.getDataObject("response");
			if (null != response) {
				DataList dlist = response.getDataList("data");
				if (!dlist.isEmpty()) {
					ret = dlist.getDataObject(0);
				}
			}
		}
		
		return ret;
	}
	
	/**
	 * Gets user session object by provided userId
	 * @param sesDS UserSession DataSource
	 * @param userId User ID
	 * @return User session object matching provided ID or null
	 */
	private DataObject getUserSessionObject(SWBDataSource sesDS, String userId) {
		DataObject ret = null;
		DataObject queryObj = new DataObject();
		
		queryObj.put("user", userId);
		
		DataObject dsFetch = null;
		if (null != sesDS) {
			try {
				DataObject wrapper = new DataObject();
				wrapper.put("data", queryObj);
				dsFetch = sesDS.fetch(wrapper);
			} catch (IOException ioex) {
				ioex.printStackTrace();
			}
		}
		
		if (null != dsFetch) {
			DataObject response = dsFetch.getDataObject("response");
			if (null != response) {
				DataList dlist = response.getDataList("data");
				if (!dlist.isEmpty()) {
					ret = dlist.getDataObject(0);
				}
			}
		}
		
		return ret;
	}
	
	/**
	 * Checks whether an API Key exists in datasource 
	 * @param authCredentials authorization header
	 * @return true if API Key exists in datasource
	 */
	private boolean isAPIKeyValid(String key) {
		if (null != key && !key.isEmpty()) {
			engine = DataMgr.initPlatform(null);
			SWBDataSource ds = engine.getDataSource("APIKey");
			DataObject queryObj = new DataObject();
			queryObj.put("appKey", key);
				
			DataObject dsFetch = null;
			try {
				DataObject wrapper = new DataObject();
				wrapper.put("data", queryObj);
				dsFetch = ds.fetch(wrapper);
			} catch (IOException ioex) {
				ioex.printStackTrace();
			}
				
			if (null != dsFetch) {
				DataObject response = dsFetch.getDataObject("response");
				if (null != response) {
					DataList dlist = response.getDataList("data");
					if (!dlist.isEmpty()) {
						return true;
					}
				}
			}
		}
		return false;
	}
	
	/**
	 * Gets user object by provided email and password
	 * @param sesDS User DataSource
	 * @param email User email
	 * @param password User password
	 * @return User object matching provided data or null
	 */
	private DataObject findUser(SWBDataSource userDS, String email, String password) {
		DataObject ret = null;
		DataObject queryObj = new DataObject();
		
		queryObj.put("email", email);
		queryObj.put("password", DataUtils.encodeSHA(password));
		
		DataObject dsFetch = null;
		if (null != userDS) {
			try {
				DataObject wrapper = new DataObject();
				wrapper.put("data", queryObj);
				dsFetch = userDS.fetch(wrapper);
			} catch (IOException ioex) {
				ioex.printStackTrace();
			}
		}
		
		if (null != dsFetch) {
			DataObject response = dsFetch.getDataObject("response");
			if (null != response) {
				DataList dlist = response.getDataList("data");
				if (!dlist.isEmpty()) {
					ret = dlist.getDataObject(0);
				}
			}
		}
		
		return ret;
	}
}
