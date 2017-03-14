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
import org.semanticwb.datamanager.DataList;
import org.semanticwb.datamanager.DataObject;

public class DBFExtractor extends PMExtractorBase {
	/**
	 * Constructor. Creates a new instance of a DBFExtractor.
	 */
	public DBFExtractor(DataObject def) {
		super(def);
	}
	
	@Override
	public void store() {
		String filePath = "";
		HashMap<String, DataObject> colMapping = new HashMap<>();
		Properties props = new Properties();
		//ScriptObject extractorDef = base.getScriptObject();
		String dbPath = filePath.substring(0, filePath.lastIndexOf("/"));
		String tblName = filePath.substring(filePath.lastIndexOf("/")+1, filePath.length());
		String charset = extractorDef.getString("charset");
		boolean clearDS= Boolean.valueOf(extractorDef.getString("overwrite"));
		if (null == charset || charset.isEmpty()) charset = "UTF-8";
		
		tblName = tblName.substring(0, tblName.lastIndexOf("."));
		props.put("fileExtension", ".dbf");
		props.put("charset", charset);
		
		//Get column mapping
		DataList columnMapping = extractorDef.getDataList("columns");
		if (null != columnMapping) {
			Iterator<DataObject> colMap = columnMapping.iterator();
			while (colMap.hasNext()) {
				DataObject col = colMap.next();
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
		    
		    //Clear datasource
		    if (clearDS) {
		    	DataObject q = new DataObject();
		    	q.addParam("removeByID", false);
		    	q.addParam("data", new DataObject());
		    	//base.getDataSource().remove(q);
		    }
		    
		    while(results.next()) {
		    	DataObject obj = new DataObject(); 
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
		    	//base.getDataSource().addObj(obj);
		    }
		} catch (SQLException sqlex) {
			sqlex.printStackTrace();
		//} catch (IOException ioex) {
		//	ioex.printStackTrace();
		} finally {
			if (null != conn) {
				try {
					conn.close();
				} catch(SQLException sqex) { }
			}
		}
	}
}