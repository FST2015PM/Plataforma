package org.fst2015pm.swbforms.extractors;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Properties;

import org.fst2015pm.swbforms.utils.FSTUtils;
import org.semanticwb.datamanager.DataObject;

/**
 * CSV Extractor implementation.
 * @author Hasdai Pacheco
 *
 */
public class CSVExtractor extends PMExtractorBase {
	/**
	 * Constructor. Creates a new Instance of CSVExtractor.
	 */
	public CSVExtractor (DataObject def) {
		super(def);
	}
	
	@Override
	public void store(String filePath) {
		HashMap<String, DataObject> colMapping = new HashMap<>();
		Properties props = new Properties();
		String dbPath = filePath.substring(0, filePath.lastIndexOf("/"));
		String tblName = filePath.substring(filePath.lastIndexOf("/")+1, filePath.length());
		String charset = extractorDef.getString("charset");
		if (null == charset || charset.isEmpty()) charset = "UTF-8";
		
		tblName = tblName.substring(0, tblName.lastIndexOf("."));
		props.put("charset", charset);
		props.put("columnTypes", "");
		
		//Get column mapping
		DataObject columnMapping = extractorDef.getDataObject("columns");
		if (null != columnMapping) {
			//Iterator<ScriptObject> colMap = columnMapping.values().iterator();
			Iterator<Object> colMap = columnMapping.values().iterator();
			while (colMap.hasNext()) {
				DataObject col = (DataObject) colMap.next();
				if (null != col.getString("src")) {
					colMapping.put(col.getString("src"), col);
				}
			}
		}
		
		try {
			Class.forName("org.relique.jdbc.csv.CsvDriver");
		} catch (ClassNotFoundException cnfex) {
			cnfex.printStackTrace();
		}
		
		Connection conn = null;
		try {
			conn = DriverManager.getConnection("jdbc:relique:csv:" + dbPath, props);
		    Statement stmt = conn.createStatement();
		    ResultSet results = stmt.executeQuery("SELECT * FROM "+tblName);
		    
		    while(results.next()) {
		    	DataObject obj = new DataObject(); 
		    	for(String key : colMapping.keySet()) {
		    		DataObject entry = (DataObject) colMapping.get(key);
		    		String finalField = null != entry.getString("dest") ? entry.getString("dest") : key;
		    		String dataType = null != entry.getString("type") ? entry.getString("type") : "string";
		    		
		    		int colIdx = results.findColumn(key);
		    		Object val = FSTUtils.DATA.inferTypedValue(results.getString(colIdx));//TODO: Verificar tipos de datpos en columnas con el driver
		    		//System.out.println("Key: "+key+", finalName: "+finalField+", colIndex: "+colIdx);
		    		if (null != val) {
		    			obj.put(finalField, val);
		    		}
		    	}
		    	//extractorDef.getDataSource().addObj(obj);
		    }
		} catch (SQLException sqlex) {
			sqlex.printStackTrace();
		//} catch (IOException ioex) {
	//		ioex.printStackTrace();
		} finally {
			if (null != conn) {
				try {
					conn.close();
				} catch(SQLException sqex) { }
			}
		}
	}
}
