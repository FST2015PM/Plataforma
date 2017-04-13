package org.fst2015pm.swbforms.extractors;

import java.io.IOException;

/**
 * Interface that defines store method for extractors.
 * @author Hasdai Pacheco
 *
 */
public interface PMExtractor {
	/**
	 * Starts extractor execution
	 */
	public void start();
	
	/**
	 * Stops extractor execution
	 */
	public void stop();
	
	/**
	 * Extracts data
	 */
	public void extract() throws IOException;
	
	/**
	 * Gets extractor status
	 * @return STARTED | EXTRACTING | STOPPED
	 */
	public String getStatus();
	
	/**
	 * Gets extractor name
	 * @return Extractor name
	 */
	public String getName();
	
	/**
	 * Checks whether extractor can be started
	 * @return true if extractor can be started
	 */
	public boolean canStart();
	
	/**
	 * Gets extractor type. Must correspond to a file extension.
	 * @return Extractor type (CSV|DBF|KML).
	 */
	public String getType();
}