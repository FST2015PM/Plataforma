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

import org.fst2015pm.swbforms.extractors.ExtractorManager;
import org.semanticwb.datamanager.SWBScriptEngine;
import org.semanticwb.datamanager.SWBScriptUtils;

@Path("/services/extractor")
public class ExtractorService {
	SWBScriptEngine engine;
	SWBScriptUtils utils;
	ExtractorManager extractorManager = ExtractorManager.getInstance();
	@Context HttpServletRequest httpRequest;
	private final static String ERROR_FORBIDDEN = "{\"error\":\"Unauthorized\"}";
	private final static String ERROR_BADREQUEST = "{\"error\":\"Bad request\"}";
	
	@GET
	@Path("/status/{objId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getExtractorStatus(@PathParam("objId") String oId) {
		HttpSession session = httpRequest.getSession();

		if (null != session.getAttribute("_USER_")) {
			if (null == oId || oId.isEmpty()) return Response.status(400).build();
			String status = extractorManager.getStatus(oId);
			
			return Response.status(200).entity("{\"status\":\"" + status + "\"}").build();
		}
		
		return Response.status(401).build();
	}
	
	@POST
	@Path("/start/{objId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response startExtractor(@PathParam("objId") String oId) {
		HttpSession session = httpRequest.getSession();

		if (null != session.getAttribute("_USER_")) {
			if (null == oId || oId.isEmpty()) return Response.status(400).build();
			extractorManager.startExtractor(oId);
			
			return Response.status(200).build();
		}
		
		return Response.status(401).build();
	}
	
	@POST
	@Path("/load/{objId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response loadExtractor(@PathParam("objId") String oId) {
		HttpSession session = httpRequest.getSession();

		if (null != session.getAttribute("_USER_")) {
			if (null == oId || oId.isEmpty()) return Response.status(400).build();
			extractorManager.loadExtractor(oId);
			
			return Response.status(200).build();
		}
		
		return Response.status(401).build();
	}
}
