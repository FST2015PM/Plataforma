package org.fst2015pm.swbforms.extractors;

import java.io.File;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Properties;

import org.fst2015pm.swbforms.utils.CSVDBFReader;
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
		boolean zipped = extractorDef.getBoolean("zipped", false);
		String relPath = zipped ? extractorDef.getString("zipPath") : "tempFile.csv";
		String charset = extractorDef.getString("charset");
		String overwrite = extractorDef.getString("overwrite");
		
		boolean clearDS = true;
		if (null == overwrite || overwrite.isEmpty()) {
			clearDS = true;
		} else {
			clearDS = Boolean.valueOf(overwrite);
		}
		
		CSVDBFReader reader;
		if (null == charset || charset.isEmpty()) {
			reader = new CSVDBFReader(filePath);
		} else {
			Properties props = new Properties();
			props.setProperty("charset", charset);
			reader = new CSVDBFReader(filePath, props);
		}
		
		//File tempJson = new  File(FileUtils.getTempDirectory() + "/tempJSON.json");
		//BufferedWriter w = null;
		//System.out.println("Writing to "+tempJson.getAbsolutePath());
		
		try {
			//w = new BufferedWriter(new FileWriter(tempJson));
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
		    	//w.write(obj.toString());
		    	getDataSource().addObj(obj);
		    }
		    //w.close();
		} catch (SQLException sqlex) {
			sqlex.printStackTrace();
			setStatus(STATUS.ABORTED);
		} catch (IOException ioex) {
			setStatus(STATUS.ABORTED);
			ioex.printStackTrace();
		} finally {
			reader.closeConnection();
			log.info("PMExtractor :: Cleaning file system...");
			/*try {
				if (null != w) w.close();
			} catch (IOException e) {
				
			}*/
			org.apache.commons.io.FileUtils.deleteQuietly(new File(filePath));
		}
		
		/*HashMap<String, DataObject> colMapping = new HashMap<>();
		Properties props = new Properties();
		String dbPath = filePath.substring(0, filePath.lastIndexOf("/"));
		String tblName = filePath.substring(filePath.lastIndexOf("/")+1, filePath.length());
		String charset = extractorDef.getString("charset");
		if (null == charset || charset.isEmpty()) charset = "UTF-8";
		
		tblName = tblName.substring(0, tblName.lastIndexOf("."));
		props.put("charset", charset);
		props.put("columnTypes", "");*/
		
		//Get column mapping
		/*DataObject columnMapping = extractorDef.getDataObject("columns");
		if (null != columnMapping) {
			//Iterator<ScriptObject> colMap = columnMapping.values().iterator();
			Iterator<Object> colMap = columnMapping.values().iterator();
			while (colMap.hasNext()) {
				DataObject col = (DataObject) colMap.next();
				if (null != col.getString("src")) {
					colMapping.put(col.getString("src"), col);
				}
			}
		}*/
		
		/*try {
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
		    }
		} catch (SQLException sqlex) {
			sqlex.printStackTrace();
		} finally {
			if (null != conn) {
				try {
					conn.close();
				} catch(SQLException sqex) { }
			}
		}*/
	}
	
	@Override
	public String getType() {
		return "CSV";
	}
}
