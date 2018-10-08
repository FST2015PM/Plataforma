package org.fst2015pm.swbforms.extractors;

import org.fst2015pm.swbforms.utils.CSVDBFReader;
import org.fst2015pm.swbforms.utils.FSTUtils;
import org.semanticwb.datamanager.DataList;
import org.semanticwb.datamanager.DataObject;
import org.semanticwb.datamanager.SWBDataSource;
import org.semanticwb.datamanager.SWBScriptEngine;

import java.io.File;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Properties;

/**
 * CSV Extractor implementation.
 * @author Hasdai Pacheco
 *
 */
public class CSVExtractor extends PMExtractorBase {
    /**
     * Constructor. Creates a new Instance of CSVExtractor.
     */
    public CSVExtractor (DataObject def) {
        super(def);
    }

    @Override
    public void store(String filePath) {
        boolean zipped = extractorDef.getBoolean("zipped", false);
        String relPath = zipped ? extractorDef.getString("zipPath") : "tempFile.csv";
        String charset = extractorDef.getString("charset");
        String overwrite = extractorDef.getString("overwrite");

        boolean clearDS = true;
        if (null == overwrite || overwrite.isEmpty()) {
            clearDS = true;
        } else {
            clearDS = Boolean.valueOf(overwrite);
        }

        CSVDBFReader reader;
        if (null == charset || charset.isEmpty()) {
            reader = new CSVDBFReader(filePath);
        } else {
            Properties props = new Properties();
            props.setProperty("charset", charset);
            reader = new CSVDBFReader(filePath, props);
        }

        //File tempJson = new  File(FileUtils.getTempDirectory() + "/tempJSON.json");
        //BufferedWriter w = null;
        //System.out.println("Writing to "+tempJson.getAbsolutePath());

        try {
            //w = new BufferedWriter(new FileWriter(tempJson));
            boolean hasMapping = false;
            ResultSet results = reader.readResultSet(relPath, 0);
            ResultSetMetaData md = results.getMetaData();
            ArrayList<String> cids = new ArrayList<>();
            ArrayList<String> ctypes = new ArrayList<>();

            //Try to get column mapping
            DataList cols = getDataSourceColumns();
            if (null != cols) {
                Iterator<DataObject> colMap = cols.iterator();
                while (colMap.hasNext()) {
                    DataObject col = colMap.next();
                    cids.add(col.getString("name"));
                    ctypes.add(col.getString("type"));
                }

                if (!cids.isEmpty()) hasMapping = true;
            }

            //If no mapping get column names from metadata
            if (!hasMapping) {
                for (int i = 1; i <= md.getColumnCount(); i++) {
                    cids.add(md.getColumnName(i));
                }
            }

            //System.out.println("Extractor "+getName()+(hasMapping ? " has mapping":" does not have mapping"));
            //Clear datasource
            if (clearDS) {
                DataObject q = new DataObject();
                q.addParam("removeByID", false);
                q.addParam("data", new DataObject());

                getDataSource().remove(q);
            }

            while(results.next()) {
                DataObject obj = new DataObject();
                for (int i = 0; i < cids.size(); i++) {
                    String cname = cids.get(i);

                    try {
                        String cval = results.getString(cname);
                        Object val = null;
                        if (hasMapping) {
                            String ctype = ctypes.get(i).toUpperCase();
                            val = getTypedValue(ctype, cval);
                        } else {
                            val = FSTUtils.DATA.inferTypedValue(cval);
                        }
                        obj.put(cname, val);
                    } catch (SQLException sqex) {

                    }
                }
                getDataSource().addObj(obj);
            }
        } catch (SQLException sqlex) {
            sqlex.printStackTrace();
            setStatus(STATUS.ABORTED);
        } catch (IOException ioex) {
            setStatus(STATUS.ABORTED);
            ioex.printStackTrace();
        } finally {
            reader.closeConnection();
            log.info("PMExtractor :: Cleaning file system...");
            org.apache.commons.io.FileUtils.deleteQuietly(new File(filePath));
        }
    }

    private DataList getDataSourceColumns() {
        SWBScriptEngine engine = getDataSource().getScriptEngine();
        SWBDataSource ds = engine.getDataSource("DBDataSource");
        DataObject dsFetch = null;
        DataList dlist = null;

        try {
            DataObject wrapper = new DataObject();
            DataObject q = new DataObject();
            q.put("name", getDataSource().getName());
            wrapper.put("data", q);
            dsFetch = ds.fetch(wrapper);

            if (null != dsFetch) {
                DataObject response = dsFetch.getDataObject("response");
                if (null != response) {
                    dlist = response.getDataList("data");
                    if (!dlist.isEmpty()) {
                        DataObject dse = dlist.getDataObject(0);
                        return dse.getDataList("columns");
                    }
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return null;
    }

    @Override
    public String getType() {
        return "CSV";
    }
}
