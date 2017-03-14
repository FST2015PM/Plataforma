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
}