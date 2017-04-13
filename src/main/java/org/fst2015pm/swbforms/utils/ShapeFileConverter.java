package org.fst2015pm.swbforms.utils;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.DecimalFormat;
import java.util.logging.Logger;

import org.geotools.data.FileDataStoreFinder;
import org.geotools.data.shapefile.ShapefileDataStore;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.data.simple.SimpleFeatureIterator;
import org.geotools.data.simple.SimpleFeatureSource;
import org.geotools.data.store.ContentFeatureCollection;
import org.geotools.factory.Hints;
import org.geotools.feature.DefaultFeatureCollection;
import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.geotools.geojson.feature.FeatureJSON;
import org.geotools.geometry.jts.JTS;
import org.geotools.referencing.CRS;
import org.geotools.referencing.ReferencingFactoryFinder;
import org.opengis.feature.Property;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.NoSuchAuthorityCodeException;
import org.opengis.referencing.crs.CRSAuthorityFactory;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.operation.TransformException;

import com.vividsolutions.jts.geom.Geometry;

/**
 * Utility class to transform shp files.
 * @author Ismene Torres
 * @author Hasdai Pacheco
 *
 */
public class ShapeFileConverter {
	static Logger log = Logger.getLogger(ShapeFileConverter.class.getName());
	private static final String code = "EPSG:4326";

	public ShapeFileConverter() { }

	/**
	 * Creates a CoordinateReferenceSystem.
	 * @return CoordinateReferenceSystem.
	 * @throws NoSuchAuthorityCodeException
	 * @throws FactoryException
	 */
	public CoordinateReferenceSystem validCRS() {
		System.setProperty("org.geotools.referencing.forceXY", "true");
		Hints hints = new Hints(Hints.FORCE_LONGITUDE_FIRST_AXIS_ORDER, Boolean.TRUE);
		CRSAuthorityFactory factory = ReferencingFactoryFinder.getCRSAuthorityFactory("EPSG", hints);
		try {
			CoordinateReferenceSystem targetCRS = factory.createCoordinateReferenceSystem(code);
			return targetCRS;
		} catch (FactoryException ex) {
			return null;
		}
	}

	/**
	 * Reads a shapeFile and gets a SimpleFeatureCollection.
	 * @param Shapefile Path to shape file to read from.
	 * @return SimpleFeatureCollection.
	 */
	public SimpleFeatureCollection readShapefile(String Shapefile) {
		File fileShape = new File(Shapefile);
		if (!fileShape.exists()) return null;

		fileShape.setReadOnly();
		
		CoordinateReferenceSystem targetCRS = validCRS();
		URL shapeFileUrl = null;
		try {
			shapeFileUrl = fileShape.toURI().toURL();
		} catch (MalformedURLException muex) {
			return null;
		}
		
		SimpleFeatureIterator iterator = null;
		ShapefileDataStore data = null;
		
		try {
			data = (ShapefileDataStore) FileDataStoreFinder.getDataStore(shapeFileUrl);
			SimpleFeatureSource sourceDBF = data.getFeatureSource();
			SimpleFeatureType schemaDBF = sourceDBF.getSchema();
			CoordinateReferenceSystem sourceCRS = schemaDBF.getCoordinateReferenceSystem();

			if (!sourceCRS.equals(targetCRS)) {
				log.info("Converting file " + fileShape.getName());
				
				MathTransform transform = CRS.findMathTransform(sourceCRS, targetCRS, true);
				SimpleFeatureBuilder fb = new SimpleFeatureBuilder(schemaDBF);
				DefaultFeatureCollection CollectionDest = new DefaultFeatureCollection(null, schemaDBF);
				ContentFeatureCollection collectionDBF = (ContentFeatureCollection) sourceDBF.getFeatures();

				iterator = collectionDBF.features();
				while (iterator.hasNext()) {
					SimpleFeature feature = iterator.next();

					Geometry sourceGeoDBF = (Geometry) feature.getDefaultGeometry();
					Geometry reprojectedGeometryDBF = JTS.transform(sourceGeoDBF, transform);
					feature.setDefaultGeometry(reprojectedGeometryDBF);

					for (Property attribute : feature.getProperties()) {
						if (attribute.getValue().getClass() == Double.class) {
							Double trans = (Double) attribute.getValue();
							DecimalFormat num = new DecimalFormat("###.00");
							fb.add(num.format(trans));
						} else if (attribute.getValue().getClass() == Integer.class) {
							fb.add(Integer.parseInt(attribute.getValue().toString()));
						} else {
							fb.add(attribute.getValue().toString());
						}
					}

					SimpleFeature featureDest = fb.buildFeature(feature.getID());
					CollectionDest.add(featureDest);

				}
				return CollectionDest;
			}
		} catch (IOException ioex) {
			ioex.printStackTrace();
		} catch (FactoryException fex) {
			fex.printStackTrace();
		} catch (TransformException tsex) {
			tsex.printStackTrace();
		} finally {
			if (null != iterator) iterator.close();
			if (null != data) data.dispose();
		}
		
		return null;
	}

	/**
	 * Transforms a shapeFile to geoJSON.
	 * 
	 * @param newName
	 *            ruta y nombre de donde se guardara el geojson
	 * @param usuShape
	 *            ubicacion del archivo shape a convertir
	 */
	public void shapeToGeoJSON(String newName, String usuShape) {
		SimpleFeatureCollection featuresSHP = readShapefile(usuShape);

		if (featuresSHP == null) {
			log.info("El archivo no se puede leer o se encuentra vacio");
		}
		
		FeatureJSON features = new FeatureJSON();
		try (FileWriter fwriter = new FileWriter(newName + ".geojson")) {
			features.writeFeatureCollection(featuresSHP, fwriter);
		} catch (IOException e) {
			e.printStackTrace();
		}

		/*JSONObject featureCollection = new JSONObject();
		JSONObject properties = new JSONObject();
		properties.put("name", code);
		JSONObject crs = new JSONObject();
		crs.put("type", "name");
		crs.put("properties", properties);
		JSONArray inFeature = new JSONArray();

		SimpleFeatureIterator iterator = featuresSHP.features();

		while (iterator.hasNext()) {
			Integer i = 0;
			JSONObject actObject = new JSONObject();
			SimpleFeature actual = iterator.next();
			JSONObject geo = new JSONObject();
			JSONObject prop = new JSONObject();
			JSONArray arrCoor = new JSONArray();
			JSONArray detCoor = new JSONArray();

			for (Property attribute : actual.getProperties()) {
				if (attribute.getName().toString() == "the_geom") {
					geo.put("type", attribute.getType().getName().toString());

					Geometry sourceGeo = (Geometry) actual.getDefaultGeometry();
					Coordinate[] arrCoord = sourceGeo.getCoordinates();

					JSONArray coorClosePoly = new JSONArray();
					// hacer validaciones para los distitntos tipos de
					// geometrias
					for (i = 0; i < sourceGeo.getCoordinates().length; i++) {
						Coordinate coor = arrCoord[i];
						if (i == 0) {
							Coordinate coorClose = arrCoord[0];
							coorClosePoly.put(coor.x);
							coorClosePoly.put(coor.y);
						}
						// se contempla que se trabajara con mapas 2d
						JSONArray coorByProp = new JSONArray();
						coorByProp.put(coor.x);
						coorByProp.put(coor.y);

						detCoor.put(coorByProp);
					}
					detCoor.put(coorClosePoly);
					arrCoor.put(detCoor);
				} else {
					if (attribute.getValue().getClass() == Double.class) {
						Double trans = (Double) attribute.getValue();
						DecimalFormat num = new DecimalFormat("###.00");
						prop.put(attribute.getName().toString(), num.format(trans));
					} else {
						prop.put(attribute.getName().toString(), attribute.getValue());
					}
				}

			} // for properties

			geo.put("coordinates", arrCoor);
			actObject.put("geometry", geo);

			actObject.put("properties", prop);
			actObject.put("type", "Feature");
			actObject.put("id", actual.getID());
			inFeature.put(actObject);

		} // while
		System.out.println(inFeature.length());
		featureCollection.put("type", featuresSHP.getID());
		featureCollection.put("crs", crs);
		featureCollection.put("features", inFeature);

		FileWriter fileDest = new FileWriter(newName + ".geojson");
		fileDest.write(featureCollection.toString());
		fileDest.close();
		*/

	}
}