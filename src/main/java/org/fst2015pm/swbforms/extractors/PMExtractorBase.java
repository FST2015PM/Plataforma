package org.fst2015pm.swbforms.extractors;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.UUID;

import org.fst2015pm.swbforms.utils.FSTUtils;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;

/**
 * Base class for extractors. Implements methods from PMExtractor interface.
 * @author Hasdai Pacheco
 */
public class PMExtractorBase implements PMExtractor {
	protected boolean extracting;
	protected String status;
	DataObject extractorDef;
	
	/**
	 * Constructor. Creates a new instance of PMExtractorBase.
	 */
	public PMExtractorBase(DataObject def) {
		extracting = false;
		extractorDef = def;
		status = "";
	}
	
	/**
	 * Sets extractor definition.
	 * @param def Extractor definition.
	 */
	public void setExtractorDef(DataObject def) {
		extractorDef = def;
	}
	
	
	/**
	 * Gets extractor definition.
	 */
	public DataObject getExtractorDef() {
		return extractorDef;
	}
	
	@Override
	public String getStatus() {
		return status;
	}
	
	@Override
	public void extract() throws IOException {
		if (this.extracting) return; //Prevent data overwrite
		
		this.extracting = true;
		// Get scriptObject configuration parameters
		//ScriptObject extractorDef = base.getScriptObject();
		String fileUrl = extractorDef.getString("fileLocation"); //Local path or URL of remote file
		boolean zipped = Boolean.valueOf(extractorDef.getString("zipped")); //Zipped flag
		boolean remote = false;
		
		if (null == fileUrl || fileUrl.isEmpty()) {
			this.extracting = false;
			return;
		}
		
		//Prepare file system
		String destPath = DataMgr.getApplicationPath() + "tempDir/" + UUID.randomUUID();
		File destDir = new File(destPath);
		
		//Check if URL is provided
		URL url = null;
		try {
			url = new URL(fileUrl);
			remote = true;
		} catch (MalformedURLException muex) { }
		
		fileUrl = remote ? fileUrl : DataMgr.getApplicationPath() + fileUrl;
		
		//Get local or remote file, store in localPath
		if (remote) {
			System.out.println("Downloading resource "+ url +"...");
			destDir = new File(destPath,"tempFile");
			org.apache.commons.io.FileUtils.copyURLToFile(url, destDir, 5000, 5000);
			fileUrl = destPath + "/tempFile";
		}
		
		if (zipped) {
			String zipPath = extractorDef.getString("zipPath");
			if (null == zipPath || zipPath.isEmpty()) { //No relative path provided
				this.extracting = false;
				org.apache.commons.io.FileUtils.deleteQuietly(new File(destPath));
				return;
			}
			System.out.println("Inflating file...");
			FSTUtils.ZIP.extractAll(fileUrl, destPath);
			destPath += zipPath;
		}
		
		//Store data
		System.out.println("Storing data...");
		//store(base, destPath);
		store();
		System.out.println("Cleaning file system...");
		org.apache.commons.io.FileUtils.deleteQuietly(new File(destPath).getParentFile());
		this.extracting = false;
	}

	@Override
	public void start() {
		try {
			extract();
		} catch (IOException ioex) {
			ioex.printStackTrace();
		}
	}

	@Override
	public void stop() { }

	public void store() {
		throw new UnsupportedOperationException("Method not implemented");
	}

}
