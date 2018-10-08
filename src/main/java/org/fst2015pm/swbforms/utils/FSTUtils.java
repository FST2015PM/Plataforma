package org.fst2015pm.swbforms.utils;

import org.json.JSONObject;
import org.semanticwb.datamanager.DataList;
import org.semanticwb.datamanager.DataObject;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.Charset;
import java.nio.charset.CharsetDecoder;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Enumeration;
import java.util.SortedMap;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

/**
 * Class to group utilities related to File Management
 * @author Hasdai Pacheco
 *
 */
public class FSTUtils {
	/** Buffer size */
	static int BUFFER = 2048;
	static String envConfig = null;
	
	public static class DATA {
		public static Object inferTypedValue(String val) {
			Object ret = parseBoolean(val);
			if (null == ret) ret = parseInt(val);
			if (null == ret) ret = parseLong(val);
			if (null == ret) ret = parseDouble(val);
			if (null == ret) ret = (String)val;
			return ret;
		}
		
		/**
		 * Parses a string to get an Integer object
		 * @param val Value to parse
		 * @return Integer object for String value val
		 */
		public static Integer parseInt(String val) {
			Integer ret = null;
			if (null != val && !val.isEmpty()) {
				//if (val.startsWith("0") && val.length() > 1) {
				//	return ret;
				//} else {
					try {
						ret = Integer.valueOf(Integer.parseInt(val));
					} catch (NumberFormatException e) { }
				//}
			}
			
			return ret;
		}
		
		/**
		 * Parses a string to get an Long object
		 * @param val Value to parse
		 * @return Long object for String value val
		 */
		public static Long parseLong(String val) {
			Long ret = null;
			if (null != val && !val.isEmpty()) {
				try {
					ret = Long.valueOf(Long.parseLong(val));
				} catch (NumberFormatException e) { }
			}
			return ret;
		}
		
		/**
		 * Parses a string to get an Float object
		 * @param val Value to parse
		 * @return Float object for String value val
		 */
		public static Float parseFloat(String val) {
			Float ret = null;
			if (null != val && !val.isEmpty()) {
				val = val.replace(",", ".");
				try {
					ret = Float.valueOf(Float.parseFloat(val));
				} catch (NumberFormatException e) { }
			}
			return ret;
		}
		
		/**
		 * Parses a string to get an Double object
		 * @param val Value to parse
		 * @return Float object for String value val
		 */
		public static Double parseDouble(String val) {
			Double ret = null;
			if (null != val && !val.isEmpty()) {
				val = val.replace(",", ".");
				try {
					ret = Double.valueOf(Double.parseDouble(val));
				} catch (NumberFormatException e) { }
			}
			return ret;
		}
		
		/**
		 * Parses a string to get an Boolean object
		 * @param val Value to parse
		 * @return Boolean object for String value val
		 */
		public static Boolean parseBoolean(String val) {
			Boolean ret = null;
			if (null != val && !val.isEmpty() && ("true".equalsIgnoreCase(val) || "false".equalsIgnoreCase(val))) {
				try {
					ret = Boolean.valueOf(Boolean.parseBoolean(val));
				} catch (NumberFormatException e) { }
			}
			return ret;
		}
	}
	
	public static class FILE {
		private static final SortedMap<String, Charset> charsets = Charset.availableCharsets();
		/**
		 * Stores base64 encoded image in file system
		 * @param path Path to store file
		 * @param name Name of the file
		 * @param content Base64 encoded file content
		 * @return true if file could be stored
		 */
		public static boolean storeBase64File(String path, String name, String content) {
			try {
				String cData = content;
				if (cData.contains(",")) {
					cData = content.split(",")[1];
				}
				byte[] data = Base64.getDecoder().decode(cData.getBytes("UTF-8"));
				File f = new File(path);
				if (!f.exists())  f.mkdirs();
				
				OutputStream stream = new FileOutputStream(path + "/" + name);
			    stream.write(data);
			    stream.close();
			    return true;
			} catch (IOException ex) {
				ex.printStackTrace();
				return false;
			}
		}
		
		//public static File f = new File();
		public Charset findCharset(File file) {
			Charset ret = null;
			for (String charsetName : charsets.keySet()) {
				ret = testCharset(file, charsets.get(charsetName));
			}
			
			return ret;
		}
		
		private static Charset testCharset (File f, Charset cs) {
			try {
	            BufferedInputStream input = new BufferedInputStream(new FileInputStream(f));

	            CharsetDecoder decoder = cs.newDecoder();
	            decoder.reset();

	            byte[] buffer = new byte[512];
	            boolean identified = false;
	            while ((input.read(buffer) != -1) && (!identified)) {
	                identified = testBytes(buffer, decoder);
	            }

	            input.close();

	            if (identified) {
	                return cs;
	            } else {
	                return null;
	            }
	        } catch (Exception ex) {
	            return null;
	        }
		}
		
		private static boolean testBytes (byte[] bytes, CharsetDecoder csd) {
			try {
	            csd.decode(ByteBuffer.wrap(bytes));
	        } catch (CharacterCodingException cee) {
	            return false;
	        }
	        return true;
		}
		
		public static String downloadResource(String urlString, String fileName, boolean zipped) {
			String destPath = org.apache.commons.io.FileUtils.getTempDirectoryPath();
			if (!destPath.endsWith("/")) destPath += "/";
			destPath += UUID.randomUUID().toString().replace("-", "");
			
			String rPath = downloadResource(urlString, destPath, fileName);
			if (zipped) {
				File fPath = new File(rPath, fileName);
				FSTUtils.ZIP.extractAll(fPath.getAbsolutePath(), rPath);
			}
			return rPath;
		}
		
		/**
		 * Downloads a resource to a given path and renames to a given name.
		 * @param urlString Resource URL.
		 * @param destPath Path to folder to download to.
		 * @param fileName Name of downloaded file. "tempFile" will be used as default name.
		 * @param zipped Whether the downloaded resource is zipped. Resource will be extracted if needed. 
		 * @return Path to resource folder or empty string.
		 */
		public static String downloadResource(String urlString, String destPath, String fileName) {
			File destDir;
			if (null != fileName && !fileName.isEmpty()) {
				 destDir = new File(destPath, fileName);
			} else {
				 destDir = new File(destPath, "tempFile");
			}
			
			URL url = null;
			try {
				url = new URL(urlString);
			} catch (MalformedURLException muex) {
				return "";
			}
			
			try {
				System.out.println("..Downloading resource "+url);
				org.apache.commons.io.FileUtils.copyURLToFile(url, destDir, 5000, 5000);
			} catch (IOException ex) {
				ex.printStackTrace();
				return "";
			}
			
			return destPath;
		}
	}
	
	public static class ZIP {
		/**
		 * Extracts a ZIP file to a destination directory.
		 * @param source Path for the source ZIP file.
		 * @param dest Path of target directory.
		 */
		public static void extractAll(String source, String dest) {
			ZipFile zip = null;
			
			try {
				File file = new File(source);
		        zip = new ZipFile(file);
		        
		        String destPath = dest;
		        new File(destPath).mkdir();
		        
		        Enumeration<? extends ZipEntry> zipEntries = zip.entries();
		        while (zipEntries.hasMoreElements()) {
		            ZipEntry entry = (ZipEntry) zipEntries.nextElement();
		            String current = entry.getName();

		            File destFile = new File(destPath, current);
		            File destinationParent = destFile.getParentFile();
		            destinationParent.mkdirs();

		            if (!entry.isDirectory()) {
		            	int chunk;
		                byte data[] = new byte[BUFFER];
		                BufferedInputStream is = new BufferedInputStream(zip.getInputStream(entry));
		                FileOutputStream fos = new FileOutputStream(destFile);
		                BufferedOutputStream target = new BufferedOutputStream(fos, BUFFER);

		                while ((chunk = is.read(data, 0, BUFFER)) != -1) {
		                    target.write(data, 0, chunk);
		                }
		                
		                target.flush();
		                target.close();
		                is.close();
		            }
		        }
		    } catch (Exception e)  {
		        e.printStackTrace();
		    }
		}
	}
	
	public static class API {
		public static SecretKey generateSecretKey(String base64Key) throws NoSuchAlgorithmException {
			if (null != base64Key && !base64Key.isEmpty()) {
				byte[] decoded = Base64.getDecoder().decode(base64Key);
				return new SecretKeySpec(decoded, 0, decoded.length, "HmacSHA256"); 
			}
			return KeyGenerator.getInstance("HmacSHA256").generateKey();
		}
		
		public static String generateAPIKey() {
			String ret = null;
			try {
				ret = Base64.getEncoder().encodeToString(generateSecretKey(null).getEncoded());
			} catch (NoSuchAlgorithmException nsaex) {
				System.out.print("Bad generator algorithm name");
			}
			
			return ret;
		}
		
		public static DataList<DataObject> buildAggregationPipeline(String filterField, Object filterValue, String groupField, String displayField, String operation, String sort) {
			DataList<DataObject> pipelineDL = new DataList<>();
			JSONObject resultStage = new JSONObject();
			JSONObject resultFields = new JSONObject();
			resultFields.put("_id", 0);
			
			if (null != filterField && !filterField.isEmpty() && null != filterValue) {
				//Match on filter field and value
				JSONObject matchStage = new JSONObject();
				JSONObject matchCondition = new JSONObject();
				matchCondition.put(filterField, filterValue);
				matchStage.put("$match", matchCondition);
				DataObject matchStageObj = (DataObject) DataObject.parseJSON(matchStage.toString());
				pipelineDL.add(matchStageObj);
				
				resultFields.put(filterField, 1);
			}
			
			//Project elements on processing fields
			JSONObject projectFields = new JSONObject();
			projectFields.put("_id", 1);
			if (null != filterField && !filterField.isEmpty()) {
				projectFields.put(filterField, 1);
			}
			if (null != groupField && !groupField.isEmpty()) {
				projectFields.put(groupField, 1);
			}
			if (null != displayField && !displayField.isEmpty()) {
				projectFields.put(displayField, 1);
				resultFields.put(displayField, 1);
			}
			
			if (projectFields.length() > 0) {
				//Project document on required fields
				JSONObject projectStage = new JSONObject();
				projectStage.put("$project", projectFields);
				DataObject projectStageObj = (DataObject) DataObject.parseJSON(projectStage.toString());
				pipelineDL.add(projectStageObj);
			}
			
			//Group elements if needed
			JSONObject groupStage = new JSONObject();
			JSONObject groupCondition = new JSONObject();
			JSONObject operationCondition = new JSONObject();
			JSONObject groupKeys = new JSONObject();
			if (null != groupField && !groupField.isEmpty()) {
				groupKeys.put(groupField, "$"+groupField);
				resultFields.put(groupField, "$_id."+groupField);
			} else {
				groupKeys.put("_id", "$_id");
				resultFields.put("_id", "$_id._id");
			}
			
			if ("count".equalsIgnoreCase(operation)) {
				operationCondition.put("$sum", 1);
			} else {
				operationCondition.put("$"+operation, "$"+displayField);
			}
			groupCondition.put(displayField, operationCondition);
			groupStage.put("$group", groupCondition);
			groupCondition.put("_id", groupKeys);
			
			DataObject groupStageObj = (DataObject) DataObject.parseJSON(groupStage.toString());
			pipelineDL.add(groupStageObj);

			//Project resulting documents
			resultStage.put("$project", resultFields);
			DataObject resultStageObj = (DataObject) DataObject.parseJSON(resultStage.toString());
			pipelineDL.add(resultStageObj);
			
			//Sort stage
			JSONObject sortStage = new JSONObject();
			JSONObject sortCondition = new JSONObject();
			int sortType = 1;
			if (null != sort && "des".equalsIgnoreCase(sort)) {
				sortType = -1;
			}
			
			sortCondition.put(groupField, sortType);
			sortStage.put("$sort", sortCondition);
			pipelineDL.add((DataObject) DataObject.parseJSON(sortStage.toString()));
			
			return pipelineDL;
		}
	}
	
	public static String getEnvConfig() {
		if (null == envConfig) envConfig = System.getenv().get("FST2015PM_ENV");
		if (null == envConfig) envConfig = "development";
		return envConfig;
	}
}
