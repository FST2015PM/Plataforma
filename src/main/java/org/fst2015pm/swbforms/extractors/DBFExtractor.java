package org.fst2015pm.swbforms.extractors;

import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.fst2015pm.swbforms.servlet.PMExtractorsContextListener;
import org.fst2015pm.swbforms.utils.FSTUtils;
import org.semanticwb.datamanager.DataList;
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
		HashMap<String, DataObject> colMapping = new HashMap<>();
		Properties props = new Properties();
		String dbPath = filePath.substring(0, filePath.lastIndexOf("/"));
		String tblName = filePath.substring(filePath.lastIndexOf("/")+1, filePath.length());
		String charset = extractorDef.getString("charset");
		String overwrite = extractorDef.getString("overwrite");
		boolean clearDS = true;
		boolean mapColumns = false;
		if (null == overwrite || overwrite.isEmpty()) {
			clearDS = true;
		} else {
			clearDS= Boolean.valueOf(overwrite);
		}
		
		if (null == charset || charset.isEmpty()) charset = "UTF-8";
		
		tblName = tblName.substring(0, tblName.lastIndexOf("."));
		props.put("fileExtension", ".dbf");
		props.put("charset", charset);
		
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
			Class.forName("org.relique.jdbc.csv.CsvDriver");
		} catch (ClassNotFoundException cnfex) {
			cnfex.printStackTrace();
		}
		
		Connection conn = null;
		try {
			conn = DriverManager.getConnection("jdbc:relique:csv:" + dbPath, props);
		    Statement stmt = conn.createStatement();
		    ResultSet results = stmt.executeQuery("SELECT * FROM "+tblName);
		    
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
		//} catch (IOException ioex) {
		//	ioex.printStackTrace();
		} finally {
			if (null != conn) {
				try {
					conn.close();
				} catch(SQLException sqex) { }
			}
			log.info("PMExtractor :: Cleaning file system...");
			org.apache.commons.io.FileUtils.deleteQuietly(new File(filePath).getParentFile());
		}
	}
}