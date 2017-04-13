import java.io.IOException;

import org.fst2015pm.swbforms.utils.JsonFilesConverter;
import org.json.simple.parser.ParseException;

public class TestJson {

	public static void main(String[] args) throws IOException {
		// TODO Auto-generated method stub
		JsonFilesConverter text = new JsonFilesConverter();
		System.out.println(text.JsonToText("./src/main/webapp/app/mockdata/shape/aeropuerto.geojson"));
	}

}
