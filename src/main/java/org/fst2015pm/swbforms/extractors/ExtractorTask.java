package org.fst2015pm.swbforms.extractors;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.TimerTask;
import java.util.logging.Logger;

import org.semanticwb.datamanager.DataObject;

/**
 * Review and execute peridoc Extractors
 * 
 * @author juan.fernandez
 */
public class ExtractorTask extends TimerTask {
	private static Logger log = Logger.getLogger(ExtractorTask.class.getName());
	
    @Override
    public void run() {
        reviewExtractorPeriodicity();
    }

    /**
     * Checks extractor definitions and executes periodic Extractors accordingly.
     */
    public void reviewExtractorPeriodicity() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        
        Iterator<String> it = ExtractorManager.hmExtractor.keySet().iterator();
        while (it.hasNext()) {  //
            String next = it.next();
            DataObject dobj = null;
            
            try {
            	dobj = ExtractorManager.datasource.fetchObjById(next);
            } catch (IOException ioex) {
            	log.severe("Error getting extractor definition");
            }
            
            if (null == dobj) {
            	ExtractorManager.hmExtractor.remove(next);
            } else {
            	PMExtractor extractor = ExtractorManager.hmExtractor.get(next);
            	
            	if (null != extractor && extractor.canStart()) {
	                String lastExec = dobj.getString("lastExecution");
	                Date nextExecution = null;
		                    
	                try {
	                	if (null != lastExec && !lastExec.isEmpty()) nextExecution = sdf.parse(lastExec);
	                } catch (ParseException psex) {
	                	log.severe("Error parsing execution date");
	                }
		
	                // Revisando si tiene periodicidad
	                if (dobj.getBoolean("periodic")) {
	                	boolean extractorStarted = false;
	                	if (null == nextExecution) {
	                		extractor.start();
	                		extractorStarted = true;
	                	} else {
	                		try {
		                		long tiempo = dobj.getLong("timer");
		                    	String unidad = dobj.getString("unit");
		                    	long unitmilis = 0l;
		                    	
		                    	switch(unidad) {
		                    		case "min":
		                    			unitmilis = tiempo * 60 * 1000;
		                    			break;
		                    		case "h":
		                    			unitmilis = tiempo * 60 * 60 * 1000;
		                    			break;
		                    		case "d":
		                    			unitmilis = tiempo * 24 * 60 * 60 * 1000;
		                    			break;
		                    		case "m":
		                    			unitmilis = tiempo * 30 * 24 * 60 * 60 * 1000;
		                    			break;
		                    	}
			                    	
		                    	if (unitmilis > 0) {
		                    		unitmilis = unitmilis + nextExecution.getTime();
		                    		if(new Date().getTime() > unitmilis) {
		                                extractor.start();
		                                extractorStarted = true;
		                            }
		                    	}
	                		} catch (Exception ex) { //NFE
	                			log.severe("Error getting extractor config data");
	                		}
	                	}
	                	
	                	if (extractorStarted) {
	                		dobj.put("lastExecution", sdf.format(new Date()));
	                		try {
	                			ExtractorManager.datasource.updateObj(dobj);
	                		} catch(IOException ioex) {
	                			log.severe("Error trying to update last execution date");
	                		}
	                	}
	                }
	            }
	        }
        }
    }
}
