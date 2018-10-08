package org.fst2015pm.swbforms.utils;

import org.semanticwb.datamanager.DataMgr;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

import java.io.IOException;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Utility class to log activity to Database Logs collection.
 * @author Hasdai Pacheco
 *
 */
public class DBLogger {
    private static final Logger LOG = Logger.getLogger(DBLogger.class.getName());
    private SWBDataSource logDS;
    private static DBLogger instance;

    /**
     * Constructor. Creates a new instance of DBLogger.
     */
    private DBLogger() {
        SWBScriptEngine engine = DataMgr.initPlatform(null);
        this.logDS = engine.getDataSource("PMLog");
    }

    /**
     * Gets the instance of the DBLogger.
     * @return DBLogger instance.
     */
    public static DBLogger getInstance() {
        if (null == instance) instance = new DBLogger();
        return instance;
    }

    /**
     * Logs activity to Log collection in Database.
     * @param user User that performs action
     * @param userID User ID that performs action
     * @param fromApp Whether action comes from an external app
     * @param action Action performed
     * @param target Resource or Datasource affected by action
     */
    public void logActivity(String user, String userID, boolean fromApp, String action, String target) {
        if (null == user || user.isEmpty() ||
            null == userID || userID.isEmpty() ||
            null == action || action.isEmpty() ||
            null == target || target.isEmpty()) {
            return;
        }

        DataObject logObj = new DataObject();
        logObj.put("date", new Date());
        logObj.put("userFullName", user);
        logObj.put("userID", userID);
        logObj.put("action", action);
        logObj.put("fromApp", fromApp);
        logObj.put("target", target);

        try {
            logDS.addObj(logObj);
        } catch (IOException ioex) {
            LOG.log(Level.SEVERE, "Error writing app log", ioex);
        }
    }
}
