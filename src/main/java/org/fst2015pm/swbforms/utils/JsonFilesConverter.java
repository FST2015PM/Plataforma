package org.fst2015pm.swbforms.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Iterator;

import org.geotools.geojson.feature.FeatureJSON;
import org.geotools.geojson.geom.GeometryJSON;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;


/**
 * Multigeometry variants are only supported for MongoDB 2.5 and newer
 * @author DONAJI 
 */
public class JsonFilesConverter {
	
	/**
	 * es importante saber si la informacion se entregara en json o en bson
	 * @param JsonInformation cadena de texto con la informacion a convertir
	 * @param GeoJsonFile ruta y nombre del archivo donde se guardara la informacion
	 */
	public void textToJson(String JsonInformation, String GeoJsonFile){
		
		if (JsonInformation.isEmpty()){
			System.out.println("No hay informacion");
			System.exit(0);	
			
		}else{
			System.out.println("Inicio");
			
			/*
			JSONObject featureCollection = new JSONObject();
			featureCollection.put("type", "FeatureCollection");
			
			JSONObject properties = new JSONObject();
			properties.put("name", "ESPG:4326");
			JSONObject crs = new JSONObject();
			crs.put("type", "name");
			crs.put("properties", properties);
			featureCollection.put("crs", crs);

			JSONArray features = new JSONArray();
			//features.pu
			/*
			 * 	FileWriter fileDest = new FileWriter(newName+".geojson");
			fileDest.write(principal.toString());
			fileDest.close();
			System.out.println(fileDest);
			 * */
			
			
		}
		
		
		
	}
	/**
	 * De aun archivo en formato geoJson, se convertira un archivo adecuado para insertar en mongodb
	 * @param JsonFile 
	 * @throws IOException 
	 * @throws ParseException 
	 */
	
	public String JsonToText(String JsonFile) throws IOException{
	
	/* warning
	 * if we have Unexpected character ( ) at position 0, we will make the file again, without manipulation
	 * 
	 * */
		String info = "";
		File geoJsonFile = new File(JsonFile);	
		
	    GeometryJSON gjson = new GeometryJSON(); 
	    FeatureJSON fjson = new FeatureJSON(gjson);
	    JSONParser parser = new JSONParser();
		
		if (geoJsonFile.exists()){
			System.out.println("Leyendo archivo");			
			geoJsonFile.setReadOnly();		

			try {
				JSONObject jsonObject =  (JSONObject) parser.parse(new InputStreamReader(new FileInputStream(JsonFile)));
			
				//we only need the Features
				JSONArray jsonFeatures = (JSONArray) jsonObject.get("features");
				System.out.println(jsonFeatures.size());
				
				Iterator iteratorArr =  jsonFeatures.iterator();				
				while (iteratorArr.hasNext()){
					JSONObject featArr = (JSONObject) iteratorArr.next();
					//int keys = featArr.keySet().size();
					info += featArr.toJSONString();					
					
				}
				
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
				

			return info;
		}else{
			System.out.println("No hay informacion");
			System.exit(0);
			return null;
		}
	
	}

}
