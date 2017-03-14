package org.fst2015pm.swbforms.extractors;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.TimerTask;
import org.semanticwb.datamanager.DataObject;

/**
 * Review and execute peridoc Extractors
 * 
 * @author juan.fernandez
 */
public class ExtractorTask extends TimerTask {

    @Override
    public void run() {
        reviewExtractorPeriodicity();
    }

    public void reviewExtractorPeriodicity() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Iterator<String> it = ExtractorManager.hmExtractor.keySet().iterator();
        while (it.hasNext()) {  //
            String next = it.next();
            PMExtractor extractor = ExtractorManager.hmExtractor.get(next);
            if (null!=extractor && (extractor.getStatus().equals("STARTED")  || extractor.getStatus().equals("STOPPED"))) {
                try {
                    DataObject dobj = ExtractorManager.datasource.fetchObjById(next);
                    Date now = new Date();
                    // Revisando si tiene periodicidad
                    if (dobj.getBoolean("periodic")) {
                        //obteniendo la fecha de última ejecución
                        String lastExec = dobj.getString("lastExecution ");
                        if(null!=lastExec){
                            //obteniendo el tiempo
                            long tiempo = dobj.getInt("timer");
                            //obteniendo Unidad de tiempo: h|d|m (horas, días, meses)
                            String unidad = dobj.getString("unit");
                            long unitmilis = 1000;
                            if(unidad.equals("h")){ // equivalencia de una hora en milisegundos
                                unitmilis = 60 * 60 * 1000;
                            } else if(unidad.equals("d")){ // equivalencia de un dia en milisegundos
                                unitmilis = 24 * 60 * 60 * 1000;
                            } else if(unidad.equals("m")){// equivalencia de un mes de 30 dias a milisegundos
                                unitmilis = 30 * 24 * 60 * 60 * 1000;
                            }
                            Date nextExecution = sdf.parse(lastExec);
                            if((nextExecution.getTime()+(tiempo*unitmilis))>=now.getTime()){
                                extractor.start();
                                dobj.addParam("lastExecution ", sdf.format(now));
                                ExtractorManager.datasource.updateObj(dobj);
                            }
                        } else { // se ejecuta el extractor y se actualiza la fecha de ultima ejecucion 
                            extractor.start();
                            dobj.addParam("lastExecution ", sdf.format(now));
                            ExtractorManager.datasource.updateObj(dobj);
                        }
                    }
                } catch (IOException | ParseException e) {
                    System.out.println("Error al obtener la definición del Extractor. " + e.getMessage());
                }
            }
        }
    }
}
