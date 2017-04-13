package org.fst2015pm.swbforms.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.Properties;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Utility class that reads CSV file using JDBC CSV driver and transforms the result.
 * @author Hasdai Pacheco
 *
 */
public class CSVDBFReader {
	Connection conn = null;
	Properties conf = null;
	String path;
	boolean canRead = true;
	
	/**
	 * Constructor. Creates a new instance of a CSVDBFReader with default configuration parameters.
	 * @param path Absolute path to CSV file to read.
	 */
	public CSVDBFReader(String path) {
		this.path = path;
		conf = new Properties();
		conf.setProperty("ignoreNonParseableLines", "true");
		conf.setProperty("trimValues", "true");
		conf.setProperty("charset", "UTF-8");
		
		try {
			Class.forName("org.relique.jdbc.csv.CsvDriver");
		} catch (ClassNotFoundException cnfex) {
			cnfex.printStackTrace();
			canRead = false;
		}
		
		openConnection();
	}
	
	/**
	 * Constructor. Creates a new instance of a CSVDFBReader with provided configuration parameters.
	 * @param path Absolute path to CSV file to read.
	 * @param props Configuration properties.
	 */
	public CSVDBFReader(String path, Properties props) {
		this(path);
		
		setConfigProperties(props, true);
	}
	
	public void setConfigProperties(Properties props, boolean merge) {
		if (merge) {
			//Properties oldProps = conf;
			//conf = new Properties();
			//conf.putAll(oldProps);
			conf.putAll(props);
		} else {
			conf = props;
		}
		
		openConnection();
	}
	
	/**
	 * Opens a connection to the CSV file.
	 */
	private void openConnection() {
		closeConnection();
		try {
			conn = DriverManager.getConnection("jdbc:relique:csv:" + path, conf);
		} catch (SQLException sqlex) {
			sqlex.printStackTrace();
		}
	}
	
	/**
	 * Closes the existing connection to the CSV file.
	 */
	public void closeConnection() {
		if (null == conn) return;
		
		try {
			conn.close();
		} catch (SQLException sqlex) {
			sqlex.printStackTrace();
		} finally {
			conn = null;
		}
	}
	
	/**
	 * Reads CSV file as a ResultSet.
	 * @param tableName Name of CSV file as table.
	 * @param rowLimit Number of rows to get from CSV.
	 * @return ResultSet with CSV entries or null.
	 */
	public ResultSet readResultSet(String tableName, int rowLimit) {
		ResultSet result = null;
		if (!canRead || null == tableName || tableName.isEmpty()) return result;
		int limit = rowLimit > 0 ? rowLimit : 0;
		
		String tblName = tableName;
		if (tableName.endsWith(".csv") || tableName.endsWith(".dbf")) {
			tblName = tableName.substring(0, tableName.lastIndexOf("."));
		}
		
		if (null == conn) openConnection();
		
		try {				
		    Statement stmt = conn.createStatement();
		    result = stmt.executeQuery("SELECT * FROM " + tblName + (limit > 0 ? " LIMIT " + limit : ""));
		} catch (SQLException sqlex) {
			sqlex.printStackTrace();
		}
	
		return result;
	}
	
	/**
	 * Reads CSV file as a JSONObject.
	 * @param tableName Name of CSV file as table.
	 * @return JSONObject with an array of field names and an array of data entries.
	 */
	public JSONObject readJSON(String tblName) {
		return readJSON(tblName, false, 0);
	}
	
	/**
	 * Reads CSV file as a JSONObject.
	 * @param tableName Name of CSV file as table.
	 * @param asArray whether to create nested arrays as entries. If false, entries will be created as JSONObject.
	 * @param rowLimit Number of rows to get from CSV.
	 * @return JSONObject with an array of field names and an array of data entries.
	 */
	public JSONObject readJSON(String tableName, boolean asArray, int rowLimit) {
		JSONObject ret = new JSONObject();
		JSONArray data = new JSONArray();
		JSONArray cols = new JSONArray();
		
		ResultSet rset = readResultSet(tableName, rowLimit);
		if (null == rset) return ret;
		
		ArrayList<String> columNames = new ArrayList<>();
		try {
			ResultSetMetaData md = rset.getMetaData();
            for (int i = 1; i <= md.getColumnCount(); i++) {
            	JSONObject col = new JSONObject();
            	col.put("title", md.getColumnName(i));
            	
            	columNames.add(md.getColumnName(i));
            	cols.put(col);
            }
            ret.put("columns", cols);
            
			while(rset.next()) {
				Object entry;
				if (asArray) {
					entry = new JSONArray();
					for (String cname : columNames) {
						((JSONArray) entry).put(rset.getString(cname).trim());
					}
				} else {
					entry = new JSONObject();
					for (String cname : columNames) {
		            	((JSONObject) entry).put(cname, rset.getString(cname).trim());
		            }
				}
				data.put(entry);
			}
			ret.put("data", data);
		} catch (SQLException sqlex) {
			sqlex.printStackTrace();
		}
		
		return ret;
	}
	
	/**
	 * Reads CSV file as a CSV String.
	 * @param tableName Name of CSV file as table.
	 * @param rowLimit Number of rows to get from CSV.
	 * @return CSV String containing comma delimited and quoted values.
	 */
	public String readString(String tableName, int rowLimit) {
		String quoteChar = "\"";
		String delimiter = ",";
		String newLine = "\n";
		StringBuilder ret = new StringBuilder();
		
		ResultSet rset = readResultSet(tableName, rowLimit);
		if (null == rset) return "";
		
		try {
			ResultSetMetaData md = rset.getMetaData();
            for (int i = 1; i <= md.getColumnCount(); i++) {
            	ret.append(quoteChar).append(md.getColumnName(i)).append(quoteChar);
            	if (i < md.getColumnCount()) ret.append(delimiter);
            }
            ret.append(newLine);
            
			while(rset.next()) {
				for (int i = 1; i <= md.getColumnCount(); i++) {
					ret.append(quoteChar).append(rset.getString(i).trim()).append(quoteChar);
					if (i < md.getColumnCount()) ret.append(delimiter);
	            }
				ret.append(newLine);
			}
		} catch (SQLException sqlex) {
			sqlex.printStackTrace();
		}
		
		return ret.toString();
	}
}