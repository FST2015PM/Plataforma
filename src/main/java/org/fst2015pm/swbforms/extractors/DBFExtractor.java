package org.fst2015pm.swbforms.extractors;

import java.io.File;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Properties;
import java.util.logging.Logger;

import org.fst2015pm.swbforms.utils.CSVDBFReader;
import org.fst2015pm.swbforms.utils.FSTUtils;
import org.semanticwb.datamanager.DataObject;

public class DBFExtractor extends PMExtractorBase {
	static Logger log = Logger.getLogger(DBFExtractor.class.getName());
	/**
	 * Constructor. Creates a new instance of a DBFExtractor.
	 */
	public DBFExtractor(DataObject def) {
		super(def);
	}
	
	@Override
	public void store(String filePath) throws IOException {
		//HashMap<String, DataObject> colMapping = new HashMap<>();
		String relPath = extractorDef.getString("zipPath","tempFile");
		String charset = extractorDef.getString("charset");
		String overwrite = extractorDef.getString("overwrite");
		boolean clearDS = true;
		Properties props = new Properties();
		props.setProperty("fileExtension", ".dbf");
		
		if (null != charset && !charset.isEmpty()) props.put("charset", charset); 
		
		if (null == overwrite || overwrite.isEmpty()) {
			clearDS = true;
		} else {
			clearDS= Boolean.valueOf(overwrite);
		}
		
		CSVDBFReader reader = new CSVDBFReader(filePath, props);
		
		//Get column mapping
		/*DataList columnMapping = extractorDef.getDataList("columns");
		if (null != columnMapping) {
			System.out.print("Verificando mapeo de columnas");
			Iterator<DataObject> colMap = columnMapping.iterator();
			if (colMap.hasNext()) mapColumns = true;
			
			while (colMap.hasNext()) {
				DataObject col = colMap.next();
				System.out.print("Verificando mapeo "+col.toString());
				if (null != col.getString("src")) {
					System.out.print("Aregando mapeo a hashmap");
					colMapping.put(col.getString("src"), col);
				}
			}
		}*/
		
		
		
		try {
		    ResultSet results = reader.readResultSet(relPath, 0);
		    ResultSetMetaData md = results.getMetaData();
		    ArrayList<String> columNames = new ArrayList<String>();
            
            for (int i = 1; i <= md.getColumnCount(); i++) {
                columNames.add(md.getColumnName(i));
            }
		    
		    //Clear datasource
		    if (clearDS) {
		    	DataObject q = new DataObject();
		    	q.addParam("removeByID", false);
		    	q.addParam("data", new DataObject());
		    	
		    	getDataSource().remove(q);
		    }
		    
		    while(results.next()) {
		    	DataObject obj = new DataObject();
		    	for (int i = 0; i < columNames.size(); i++) {
                    String cname = columNames.get(i);
                    
                    obj.put(cname, FSTUtils.DATA.inferTypedValue(results.getString(cname)));
                }
		    	
		    	/*if (mapColumns) {
			    	for(String key : colMapping.keySet()) {
			    		DataObject entry = colMapping.get(key);
			    		String finalField = null != entry.getString("dest") ? entry.getString("dest") : key;
			    		String dataType = null != entry.getString("type") ? entry.getString("type") : "string";
			    		
			    		int colIdx = results.findColumn(key);
			    		Object val = FSTUtils.DATA.getTypedObject(results.getString(colIdx), dataType);
			    		//System.out.println("Key: "+key+", finalName: "+finalField+", colIndex: "+colIdx);
			    		if (null != val) {
			    			obj.put(finalField, val);
			    		}
			    	}
		    	}*/
		    	getDataSource().addObj(obj);
		    }
		} catch (SQLException sqlex) {
			sqlex.printStackTrace();
		} finally {
			reader.closeConnection();
			log.info("PMExtractor :: Cleaning file system...");
			org.apache.commons.io.FileUtils.deleteQuietly(new File(filePath));
		}
	}
	
	@Override
	public String getType() {
		return "DBF";
	}
}