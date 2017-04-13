package org.fst2015pm.swbforms.extractors;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.UUID;
import java.util.logging.Logger;

import org.fst2015pm.swbforms.utils.FSTUtils;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

/**
 * Base class for extractors. Implements methods from PMExtractor interface.
 * @author Hasdai Pacheco
 */
public class PMExtractorBase implements PMExtractor {
	static Logger log = Logger.getLogger(PMExtractorBase.class.getName());
	
	protected DataObject extractorDef;
	private SWBDataSource ds;
	private boolean extracting;
	public static enum STATUS {
		LOADED, STARTED, EXTRACTING, STOPPED, ABORTED, FAILLOAD
	}
	private STATUS status;
	
	/**
	 * Constructor. Creates a new instance of PMExtractorBase.
	 */
	public PMExtractorBase(DataObject def) {
		extracting = false;
		extractorDef = def;

		String dsName = def.getString("dataSource");
		SWBScriptEngine eng = DataMgr.initPlatform(null);
		
		ds = eng.getDataSource(dsName);
		if (null == ds) {
			eng = DataMgr.initPlatform("/app/js/datasources/datasources.js", null);
			ds = eng.getDataSource(dsName);
		}
		
		
		if (null == ds) { //try to load it from app datasources file
			status = STATUS.FAILLOAD;
		} else {
			log.info("LOADED extractor "+getName());
			status = STATUS.LOADED;
		}
	}
	
	@Override
	public String getName() {
		return null != extractorDef ? extractorDef.getString("name") : null;
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
		return status.toString();
	}
	
	@Override
	public void extract() throws IOException {		
		if (this.extracting) return; //Prevent data overwrite
		status = STATUS.EXTRACTING;
		
		this.extracting = true;
		// Get scriptObject configuration parameters
		String fileUrl = extractorDef.getString("fileLocation"); //Local path or URL of remote file
		boolean zipped = Boolean.valueOf(extractorDef.getString("zipped")); //Zipped flag
		boolean remote = false;
		
		if (null == fileUrl || fileUrl.isEmpty()) {
			this.extracting = false;
			status = STATUS.STARTED;
			return;
		}
		
		//Prepare file system
		String uuid = UUID.randomUUID().toString().replace("-", "");
		String destPath = org.apache.commons.io.FileUtils.getTempDirectoryPath() + uuid;
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
			log.info("PMExtractor :: Downloading resource "+ url +"...");
			destDir = new File(destPath,"tempFile"+(zipped ? "" : "." + getType().toLowerCase()));
			org.apache.commons.io.FileUtils.copyURLToFile(url, destDir, 5000, 5000);
			fileUrl = destPath + "/tempFile" + (zipped ? "" : "." + getType().toLowerCase());
		}
		
		if (zipped) {
			String zipPath = extractorDef.getString("zipPath");
			if (null == zipPath || zipPath.isEmpty()) { //No relative path provided
				this.extracting = false;
				org.apache.commons.io.FileUtils.deleteQuietly(new File(destPath));
				status = STATUS.STARTED;
				return;
			}
			log.info("PMExtractor :: Inflating file...");
			FSTUtils.ZIP.extractAll(fileUrl, destPath);
			//destPath += zipPath;
		}
		
		//Store data
		log.info("PMExtractor :: Storing data...");
		store(destPath);
		this.extracting = false;
		status = STATUS.STARTED;
	}
	
	public SWBDataSource getDataSource() {
		return ds;
	}
	
	@Override
	public boolean canStart() {
		return status != STATUS.FAILLOAD && (status == STATUS.STARTED || status == STATUS.STOPPED || status == STATUS.LOADED);
	}

	@Override
	public synchronized void start() {
		if (canStart()) {
			log.info("PMExtractor :: Started extractor " + getName());
			try {
				extract();
			} catch (IOException ioex) {
				ioex.printStackTrace();
			}
		}
	}

	@Override
	public synchronized void stop() {
		status = STATUS.STOPPED;
	}

	/**
	 * Stores data in extracting phase
	 * @param filePath
	 * @throws IOException
	 */
	public void store(String filePath) throws IOException {
		throw new UnsupportedOperationException("Method not implemented");
	}
	
	public String getType() {
		throw new UnsupportedOperationException("Method not implemented");
	}

}
