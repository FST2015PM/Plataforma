package org.fst2015pm.swbforms.extractors;

import java.io.IOException;
import java.lang.reflect.Constructor;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

import org.semanticwb.datamanager.DataList;
import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

/**
 * Manages extractor instances
 *
 * @author Hasdai Pacheco
 * @modified juan.fernandez
 */
public class ExtractorManager {
	private static Logger log = Logger.getLogger(ExtractorManager.class.getName());
    protected static ConcurrentHashMap<String, PMExtractor> hmExtractor = new ConcurrentHashMap<>(); //id del DataObject, instancia del extractor
    protected static SWBDataSource datasource = null;
    private static SWBScriptEngine engine = null;
    private static ExtractorManager instance = null; //  Instancia del ExtractorManager
    private long TIME_INTERVAL_REVIEW = 60000; //Se ejecutará cada 60 segundos la revisión de todos los extractores con periodicidad

    public static ExtractorManager getInstance() {
        if (null == instance) {
            instance = new ExtractorManager();
        }
        return instance;
    }

    /**
     * Initializes extractor manager
     */
    public void init() {
    	log.info("Starting PM extractor manager");
        engine = DataMgr.initPlatform(null);
        datasource = engine.getDataSource("Extractor");

        try {
            DataObject r = new DataObject();
            DataObject data = new DataObject();
            r.put("data", data);
            DataObject ret = datasource.fetch(r);
            String key = null;
            String className = null;
            DataList rdata = ret.getDataObject("response").getDataList("data");
            DataObject dobj = null;
            PMExtractor extractor = null;
            if (!rdata.isEmpty()) {
                for (int i = 0; i < rdata.size(); i++) { // Cargando los extractores al HashMap
                    dobj = rdata.getDataObject(i);  // DataObject del  extractor
                    if (null != dobj) {
                        key = dobj.getString("_id");
                        className = dobj.getString("class");
                        extractor = null;
                        if (null != className) {
                        	try {
                        		Class clz = Class.forName(className);
                        		Constructor c = clz.getConstructor(DataObject.class);
                        		extractor = (PMExtractor) c.newInstance(dobj);
                        	} catch (Exception e) {
                        		e.printStackTrace();
                        	}

                            /*if (className.endsWith("CSVExtractor")) {
                                extractor = new CSVExtractor(dobj);
                            } else if (className.endsWith("DBFExtractor")) {
                                extractor = new DBFExtractor(dobj);
                            }*/
                        }
                        hmExtractor.put(key, extractor);
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("Error al cargar el DataSource. ");
            e.printStackTrace();
        }

        // Inicializando el Timer para que empiece a ejecutar los extractores con periodicidad
        TimerTask timerTask = new ExtractorTask();
        //Corriendo el  TimerTask como daemon thread
        Timer timer = new Timer(true);
        timer.scheduleAtFixedRate(timerTask, 0, TIME_INTERVAL_REVIEW);
        //System.out.println("TimerTask started");
    }

    /**
     * Loads an extractor into extractorManager using a DataObject ID.
     *
     * @param extractorDefID DataObject containing definition of Extractor.
     */
    public void loadExtractor(String extractorDefID) {
    	try {
    		DataObject dob = datasource.fetchObjById(extractorDefID);
    		loadExtractor(dob);
    	} catch (IOException ioex) {
    		System.out.println("Error al cargar definición del extractor");
    	}
    }

    /**
     * Loads an extractor from its configuration object.
     *
     * @param extractorConfig
     */
    public void loadExtractor(DataObject extractorConfig) {
        if (null != extractorConfig) {
            String className = extractorConfig.getString("class");
            PMExtractor extractor = hmExtractor.get(extractorConfig.getId());
            String status = null;
            if (null != extractor) {  //Revisando el tipo de extractor para saber su estaus.
            	status = extractor.getStatus();
                //if (null == status && status.equals("EXTRACTING")) {
                    // el extractor tiene el status de EXTRACTING, se detiene o que se debería de hacer ??
                    //extractor.stop();
                //}
            }

            if (null != status && extractor.canStart() || null == extractor) {
                if (null != className) { // Generando la nueva instancia del extractor
                	try {
                		Class clz = Class.forName(className);
                		Constructor c = clz.getConstructor(DataObject.class);
                		extractor = (PMExtractor) c.newInstance(extractorConfig);
                	} catch (Exception e) {
                		e.printStackTrace();
                	}
                	/*if (className.endsWith("CSVExtractor")) {
                        extractor = new CSVExtractor(extractorConfig);
                    } else if (className.endsWith("DBFExtractor")) {
                        extractor = new DBFExtractor(extractorConfig);
                    }*/
                }
                hmExtractor.put(extractorConfig.getId(), extractor);
            }
        }

    }

    /**
     * Gets current status of a particular extractor
     *
     * @return
     */
    public String getStatus(String extractorId) {
        // throw new UnsupportedOperationException();
        PMExtractor ret=null;
        if (null != extractorId) {
            ret = hmExtractor.get(extractorId);
        }
        return null!=ret?ret.getStatus():null;
    }

    /**
     * Calls start method on a particular extractor
     *
     * @param extractorId
     * @return
     */
    public boolean startExtractor(String extractorId) {
        //throw new UnsupportedOperationException();
        PMExtractor ret;
        if (null != extractorId) {
            ret = hmExtractor.get(extractorId);
            if (null != ret && ret.canStart()) {//revisando si se puede inicializar el extractor
                ret.start();
                return true;
            }
        }
        return false;
    }

    /**
     * Calls stop method on a particular extractor
     *
     * @param extractorId
     * @return
     */
    public boolean stopExtractor(String extractorId) {
        // throw new UnsupportedOperationException();
        PMExtractor ret;
        if (null != extractorId) {
            ret = hmExtractor.get(extractorId);
            if (null != ret) {
                ret.stop();
                return true;
            }
        }
        return false;
    }

}
