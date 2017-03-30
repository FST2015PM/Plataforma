package org.fst2015pm.swbforms.servlet;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.fst2015pm.swbforms.extractors.ExtractorManager;

public class PMExtractorsContextListener implements ServletContextListener {
	
	@Override
	public void contextInitialized(ServletContextEvent sce) {
		ExtractorManager i = ExtractorManager.getInstance();
		i.init();
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		// TODO Auto-generated method stub
	}
}