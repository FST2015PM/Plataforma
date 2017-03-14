
import java.io.IOException;

import org.fst2015pm.swbforms.utils.*;
public class TestShape {

	public static void main(String[] args) throws IOException {
		// TODO Auto-generated method stub	
	    	     		
		ShapeFileConverter files = new ShapeFileConverter();
		files.ShpToGeoJSON("./src/main/webapp/app/mockdata/shape/uni", "./src/main/webapp/app/mockdata/shape/unidadesClimaticas.shp");	
		System.out.println("listo");
	}

}
