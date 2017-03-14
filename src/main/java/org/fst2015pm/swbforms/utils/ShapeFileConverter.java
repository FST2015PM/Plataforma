package org.fst2015pm.swbforms.utils;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.data.simple.SimpleFeatureSource;
import org.geotools.feature.FeatureCollection;
import org.geotools.feature.FeatureIterator;
import org.geotools.geojson.feature.FeatureJSON;
import org.opengis.feature.Property;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.filter.Filter;
import org.geotools.data.DataStore;
import org.geotools.data.DataStoreFinder;
import org.geotools.data.FeatureSource;
import org.geotools.data.FileDataStore;
import org.geotools.data.FileDataStoreFinder;
import org.geotools.data.Query;

public class ShapeFileConverter {

	public ShapeFileConverter() {}
	
	public SimpleFeatureCollection readShape(String usuShape) throws IOException {
		File fileShape = new File(usuShape);

		if (fileShape.exists()){
			fileShape.setReadOnly();
		    Map<String, Object> map = new HashMap<>();
		    map.put("url", fileShape.toURI().toURL());

		    DataStore dataStore = DataStoreFinder.getDataStore(map);
		    String typeName = dataStore.getTypeNames()[0];
		    FeatureSource<SimpleFeatureType, SimpleFeature> source = dataStore.getFeatureSource(typeName);
		    System.out.print(dataStore.getTypeNames()[0]+"\t");
		    Filter filter = Filter.INCLUDE;

		    FeatureCollection<SimpleFeatureType, SimpleFeature> collection = source.getFeatures(filter);
		    try (FeatureIterator<SimpleFeature> features = collection.features()) {
		       /* while (features.hasNext()) {
		            SimpleFeature feature = features.next();
		            System.out.print(feature.getID());
		            System.out.print(": ");
		            System.out.println(feature.getDefaultGeometryProperty().getValue());
		        }*/
		    }
		    FileDataStore myData = FileDataStoreFinder.getDataStore( fileShape );
		    SimpleFeatureSource  sourceDBF = myData.getFeatureSource();
		    SimpleFeatureCollection infoFeatureCollection = sourceDBF.getFeatures();
		    SimpleFeatureCollection featureCollection = sourceDBF.getFeatures();

		    SimpleFeatureType schema = sourceDBF.getSchema();
		    Query query = new Query(schema.getTypeName());


		    FeatureCollection<SimpleFeatureType, SimpleFeature> collectionDBF = sourceDBF.getFeatures(query);
		    try (FeatureIterator<SimpleFeature> features = collectionDBF.features()) {
		        while (features.hasNext()) {
		            SimpleFeature feature = features.next();
		            System.out.println(feature.getID() + ": ");
		            for (Property attribute : feature.getProperties()) {
		                System.out.println("\t"+attribute.getName()+":"+attribute.getValue() );
		            }
		        }
		    }
		    return infoFeatureCollection;
	    } else{
			System.out.println("El archivo "+usuShape+ " no existe");
			return null;
		}
	}//readShape

	public void ShpToGeoJSON(String newName, String usuShape ) throws IOException{

		SimpleFeatureCollection featuresSHP = readShape(usuShape);
		FeatureJSON io = new FeatureJSON();
		File f = new File(newName+".geojson");
		f.setWritable(true);
		io.writeFeatureCollection(featuresSHP, f);

		FeatureIterator<SimpleFeature> features = featuresSHP.features();
		/*while (features.hasNext()){
			SimpleFeature feature = features.next();
            System.out.println(feature.getID() + ": ");
           for (Property attribute : feature.getProperties()) {
                System.out.println("\t"+attribute.getName()+":"+attribute.getValue() );
            }
		}*/

	}
}
