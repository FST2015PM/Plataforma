package org.fst2015pm.swbforms.api.v1;

import java.io.IOException;
import java.util.Date;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.semanticwb.datamanager.DataList;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.DataUtils;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

/**
 * Encapsulates methods to perform API Key and user session validation for Mobile App Services.
 * @author Hasdai Pacheco {haxdai@gmail.com}
 */
public class PMCredentialsManager {
	private SWBDataSource sessionDS;
	private SWBDataSource APIKeyDS;
	private SWBDataSource userDS; 

	
	public PMCredentialsManager() {
		SWBScriptEngine engine = DataMgr.initPlatform(null);
		userDS = engine.getDataSource("User");
		sessionDS = engine.getDataSource("UserSession");
		APIKeyDS = engine.getDataSource("APIKey");
	}
	
	/**
	 * Gets user object by provided email and password
	 * @param email User email
	 * @param password User password
	 * @return User object matching provided data or null
	 */
	public DataObject findUser(String email, String password) {
		DataObject ret = null;
		DataObject queryObj = new DataObject();
		
		queryObj.put("email", email);
		if (null != password && !password.isEmpty()) {
			queryObj.put("password", DataUtils.encodeSHA(password));
		}
		
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
	
	/**
	 * Gets session user if session is valid and active
	 * @param request HTTPServletRequest
	 * @param checkCookies Whether to check additional cookies
	 * @return Active Session User or null
	 */
	public DataObject getUser(HttpServletRequest request, boolean checkCookies) {
		DataObject ret = null;
		if(validateCredentials(request, checkCookies, true)) {
			String []authorization = getAuthCredentials(request, checkCookies);
			DataObject sessObj = getUserSessionObjectByToken(authorization[1]);
			
			if (null != sessObj) {
				try {
					ret = userDS.fetchObjById(sessObj.getString("user"));
				} catch (IOException ioex) {
					ioex.printStackTrace();
				}
			}
		}
		
		return ret;
	}
	
	/**
	 * Gets user session token from authorization headers or session cookie
	 * @param request Request object
	 * @param checkCookies whether to check session cookie
	 * @return
	 */
	public String[] getAuthCredentials(HttpServletRequest request, boolean checkCookies) {
		String auth = request.getHeader("authorization");
		String[] ret = {};
		
		//Find session token in authorization headers
		if (null != auth) auth = auth.replace("Basic ", "");
		
		//Check for user session token in header string
		if (null != auth) {
			if (auth.contains(":")) {
				ret = auth.split(":");
			} else {
				ret = new String[1];
				ret [0] = auth;
			}
		}
		
		return ret;
	}
	
	/**
	 * Checks whether an API Key exists in datasource 
	 * @param authCredentials authorization header
	 * @return true if API Key exists in datasource
	 */
	public boolean isAPIKeyValid(String key) {
		if (null != key && !key.isEmpty()) {
			DataObject queryObj = new DataObject();
			queryObj.put("appKey", key);
				
			DataObject dsFetch = null;
			try {
				DataObject wrapper = new DataObject();
				wrapper.put("data", queryObj);
				dsFetch = APIKeyDS.fetch(wrapper);
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
	 * Updated session object for provided user credentials
	 * @param email User email
	 * @param password User password
	 * @param expireMinutes session timeout
	 * @return Session object updated
	 */
	public DataObject updateUserSession(String email, String password, int expireMinutes) {
		DataObject res = new DataObject();
		boolean create = false;
		
		DataObject user = findUser(email, password);
		if (null == user) {
			return null;
		}
		
		DataObject sessData = getUserSessionObject(user.getId());
		String token = UUID.randomUUID().toString().replace("-", "");
		
		//Save new session token
		if (null == sessData) {
			create = true;
			sessData = new DataObject();
			sessData.put("user", user.getId());
		}
		sessData.put("token", token);
		sessData.put("expiration", new Date().getTime() + (1000 * 60 * expireMinutes));
		
		//Update session object
		try {
			if (create) {
				sessionDS.addObj(sessData);
			} else {
				sessionDS.updateObj(sessData);
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
			
		} catch (IOException ioex) {
			ioex.printStackTrace();
		}

		return res;
	}
	
	/**
	 * Gets user session object.
	 * @param userobj User data
	 * @return User session object or null.
	 */
	public DataObject getUserSessionObject(DataObject userobj) {
		DataObject ret = null;
		DataObject queryObj = new DataObject();
		
		queryObj.put("user", userobj.getId());
		
		DataObject dsFetch = null;
		if (null != sessionDS) {
			try {
				DataObject wrapper = new DataObject();
				wrapper.put("data", queryObj);
				dsFetch = sessionDS.fetch(wrapper);
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
	 * @param userId User ID
	 * @return User session object matching provided ID or null
	 */
	public DataObject getUserSessionObject(String userId) {
		DataObject ret = null;
		DataObject queryObj = new DataObject();
		
		queryObj.put("user", userId);
		
		DataObject dsFetch = null;
		if (null != sessionDS) {
			try {
				DataObject wrapper = new DataObject();
				wrapper.put("data", queryObj);
				dsFetch = sessionDS.fetch(wrapper);
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
	 * Gets user session object by provided token
	 * @param token User token
	 * @return User session object matching provided token or null
	 */
	public DataObject getUserSessionObjectByToken(String token) {
		DataObject ret = null;
		DataObject queryObj = new DataObject();
		
		queryObj.put("token", token);
		
		DataObject dsFetch = null;
		if (null != sessionDS) {
			try {
				DataObject wrapper = new DataObject();
				wrapper.put("data", queryObj);
				dsFetch = sessionDS.fetch(wrapper);
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
	 * Checks whether a session is still active
	 * @param sessObject Session object
	 * @return
	 */
	public boolean isSessionActive(DataObject sessObject) {		
		if (null != sessObject) {
			//Check validity
			long now = new Date().getTime();
			long sessExp =  sessObject.getLong("expiration");
			
			if (now < sessExp) {
				return true;
			}
			
			//Remove session object if expired
			try {
				sessionDS.removeObj(sessObject);
			} catch(IOException ioex) {
				ioex.printStackTrace();
			}
		}
		
		return false;
	}
	
	/**
	 * Validates user credentials using authorization header in request
	 * @param request HTTPServlet request
	 * @param checkCookies Whether to check session cookie
	 * @return true if session is valid
	 */
	public boolean validateCredentials(HttpServletRequest request, boolean checkCookies) {
		return validateCredentials(request, checkCookies, false);
	}
	
	/**
	 * Validates user credentials using authorization header in request
	 * @param request HTTPServlet request
	 * @param checkCookies Whether to check session cookie
	 * @param checkSessionToken Whether to check session token
	 * @return true if session is valid
	 */
	public boolean validateCredentials(HttpServletRequest request, boolean checkCookies, boolean checkSessionToken) {
		boolean ret = false;
		String []authorization = getAuthCredentials(request, checkCookies);
		
		if (authorization.length > 0) {
			ret = isAPIKeyValid(authorization[0]);
		}
		
		if (ret && checkSessionToken) {
			ret = false;
			
			if (authorization.length == 2) {
				DataObject sessData = getUserSessionObjectByToken(authorization[1]);
				ret = isSessionActive(sessData);
			}
		}
		
		return ret;
	}
	
}
