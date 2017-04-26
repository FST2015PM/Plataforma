package org.fst2015pm.swbforms.api.v1;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.fst2015pm.swbforms.extractors.ExtractorManager;
import org.fst2015pm.swbforms.utils.DBLogger;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBScriptEngine;
import org.semanticwb.datamanager.SWBScriptUtils;

@Path("/services/extractor")
public class ExtractorService {
	@Context HttpServletRequest httpRequest;
	SWBScriptEngine engine;
	SWBScriptUtils utils;
	ExtractorManager extractorManager = ExtractorManager.getInstance();
	DBLogger logger = DBLogger.getInstance();
	
	
	@GET
	@Path("/status/{objId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getExtractorStatus(@PathParam("objId") String oId) {
		HttpSession session = httpRequest.getSession();

		if (null != session.getAttribute("_USER_")) {
			if (null == oId || oId.isEmpty()) return Response.status(400).build();
			String status = extractorManager.getStatus(oId);
			
			return Response.ok("{\"status\":\"" + status + "\"}").build();
		} else {
			return Response.status(Status.FORBIDDEN).build();
		}
	}
	
	@POST
	@Path("/start/{objId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response startExtractor(@PathParam("objId") String oId) {
		HttpSession session = httpRequest.getSession();

		if (null != session.getAttribute("_USER_")) {
			DataObject usr = (DataObject)session.getAttribute("_USER_");
			if (null == oId || oId.isEmpty()) return Response.status(400).build();
			if (extractorManager.startExtractor(oId)) {
				logger.logActivity(usr.getString("fullname"), usr.getId(), false, "EXTRACTORSTART", extractorManager.getExtractorName(oId));
			}

			return Response.ok().build();
		}
		
		return Response.status(Status.FORBIDDEN).build();
	}
	
	@POST
	@Path("/load/{objId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response loadExtractor(@PathParam("objId") String oId) {
		HttpSession session = httpRequest.getSession();

		if (null != session.getAttribute("_USER_")) {
			if (null == oId || oId.isEmpty()) return Response.status(400).build();
			extractorManager.loadExtractor(oId);
			
			return Response.ok().build();
		}
		
		return Response.status(Status.FORBIDDEN).build();
	}
}
