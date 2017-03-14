package org.fst2015pm.swbforms.utils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.ByteBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.Charset;
import java.nio.charset.CharsetDecoder;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Enumeration;
import java.util.SortedMap;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

/**
 * Class to group utilities related to File Management
 * @author Hasdai Pacheco
 *
 */
public class FSTUtils {
	/** Buffer size */
	static int BUFFER = 2048;
	
	public static class DATA {
		public static Object getTypedObject(String val, String type) {
			switch (type.toLowerCase()) {
			case "string":
				return new String(val);
			case "float":
				try {
					return Float.parseFloat(val);
				} catch (NumberFormatException nfe) {
					return null;
				}
			case "double":
				try {
					return Double.parseDouble(val);
				} catch (NumberFormatException nfe) {
					return null;
				}
			case "int":
			case "integer":
				try {
					return Integer.parseInt(val);
				} catch (NumberFormatException bfe) {
					return null;
				}
			case "boolean":
			case "bool":
				if ("true".equalsIgnoreCase(val) || "false".equalsIgnoreCase(val)) {
					return Boolean.parseBoolean(val);
				}
				return null;
			}
			
			return null;
		}
	}
	
	public static class FILE {
		//public static File f = new File();
		private static final SortedMap<String, Charset> charsets = Charset.availableCharsets();
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
	}
}
