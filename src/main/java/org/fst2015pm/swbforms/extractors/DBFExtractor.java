package org.fst2015pm.swbforms.extractors;

import java.io.File;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Properties;
import java.util.logging.Logger;

import org.fst2015pm.swbforms.utils.CSVDBFReader;
import org.fst2015pm.swbforms.utils.FSTUtils;
import org.semanticwb.datamanager.DataList;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

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
		if (null == overwrite || overwrite.isEmpty()) {
			clearDS = true;
		} else {
			clearDS= Boolean.valueOf(overwrite);
		}
		
		Properties props = new Properties();
		props.setProperty("fileExtension", ".dbf");
		
		if (null != charset && !charset.isEmpty()) props.put("charset", charset); 
		
		CSVDBFReader reader = new CSVDBFReader(filePath, props);
		
		
		try {
			boolean hasMapping = false;
		    ResultSet results = reader.readResultSet(relPath, 0);
		    ResultSetMetaData md = results.getMetaData();
		    ArrayList<String> cids = new ArrayList<>();
		    ArrayList<String> ctypes = new ArrayList<>();
            
		    //Try to get column mapping
		    DataList cols = getDataSourceColumns();
		    if (null != cols) {
		    	Iterator<DataObject> colMap = cols.iterator();
				while (colMap.hasNext()) {
					DataObject col = colMap.next();
					cids.add(col.getString("name"));
					ctypes.add(col.getString("type"));
				}
				
				if (!cids.isEmpty()) hasMapping = true;
		    }
		    
		  //If no mapping get column names from metadata
		    if (!hasMapping) {
	            for (int i = 1; i <= md.getColumnCount(); i++) {
	                cids.add(md.getColumnName(i));
	            }
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
		    	for (int i = 0; i < cids.size(); i++) {
                    String cname = cids.get(i);
                    
                    try {
                    	String cval = results.getString(cname);
                    	Object val = null;
                    	
                    	if (hasMapping) {
                        	String ctype = ctypes.get(i).toUpperCase();
                        	val = getTypedValue(ctype, cval);
                        } else {
                        	val = FSTUtils.DATA.inferTypedValue(cval);
                        }
                    	obj.put(cname, val);
                    } catch (SQLException sqex) {
                    	
                    }
                }
		    	
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
	
	private DataList getDataSourceColumns() {
		SWBScriptEngine engine = getDataSource().getScriptEngine();
		SWBDataSource ds = engine.getDataSource("DBDataSource");
		DataObject dsFetch = null;
		DataList dlist = null;

		try {
			DataObject wrapper = new DataObject();
			DataObject q = new DataObject();
			q.put("name", getDataSource().getName());
			wrapper.put("data", q);
			dsFetch = ds.fetch(wrapper);

			if (null != dsFetch) {
				DataObject response = dsFetch.getDataObject("response");
				if (null != response) {					
					dlist = response.getDataList("data");
					if (!dlist.isEmpty()) {
						DataObject dse = dlist.getDataObject(0);
						return dse.getDataList("columns");
					}
				}
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		
		return null;
	}
	
	private Object getTypedValue(String type, String source) {
		switch(type) {
			case "FLOAT": {
				return FSTUtils.DATA.parseFloat(source);
			}
			case "INTEGER": {
				return FSTUtils.DATA.parseInt(source);
			}
			case "DOUBLE": {
				return FSTUtils.DATA.parseDouble(source);
			}
			case "LONG": {
				return FSTUtils.DATA.parseLong(source);
			}
			case "BOOLEAN": {
				return FSTUtils.DATA.parseBoolean(source);
			}
			default: {
				return source;
			}
		}
	}
	
	@Override
	public String getType() {
		return "DBF";
	}
}