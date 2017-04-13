
import java.io.IOException;

import org.fst2015pm.swbforms.utils.ShapeFileConverter;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.NoSuchAuthorityCodeException;
import org.opengis.referencing.operation.TransformException;
public class TestShape {

	public static void main(String[] args) throws IOException, NoSuchAuthorityCodeException, FactoryException, TransformException {
		ShapeFileConverter files = new ShapeFileConverter();
		files.shapeToGeoJSON("./src/main/webapp/app/mockdata/shape/uniClim6", "./src/main/webapp/app/mockdata/shape/unidadesClimaticas.shp");
		//files.readShapefile("./src/main/webapp/app/mockdata/shape/unidadesClimaticas.shp");
		System.out.println("listo");
	}
}