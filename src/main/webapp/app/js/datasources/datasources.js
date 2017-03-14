var DBModel = "FST2015PM";

eng.userSessionConfig = {
  sessTime: 21600 //Session time for App services (15 days)
};

eng.dataSources["MagicTown"] = {
    scls: "MagicTown",
    modelid: DBModel,
    dataStore: "mongodb",
    displayField: "name",
    fields: [
        {name:"CVE_ENT", title:"Clave de Estado", type:"string", required: true},
        {name:"CVE_MUN", title:"Clave de Municipio", type:"string", required: true},
        {name:"CVE_LOC", title:"Clave de Localidad", type:"string", required: true},
        {name:"CVE_MTW", title:"Clave Geo", type:"string", required: true},
        {name:"name", title: "Nombre", required: true, type: "string"},
        {name:"description", title: "Descripción", type: "string"},
        {name:"accepted", title:"Incorporado", type:"boolean"},
        {name:"inclusion_date", title:"Fecha de incorporación", type: "date"},
        {name:"origin", title: "Imagen", type: "string"},
        {name:"picture", title: "Imagen", type: "string"}
    ]
};
eng.dataSources["State"] = {
    scls: "State",
    modelid: DBModel,
    dataStore: "mongodb",
    displayField: "NOM_ENT",
    fields: [
        {name: "NOM_ENT", title: "Estado", required: true, type: "string"},
        {name: "CVE_ENT", title: "Clave", required: true, type: "string"},
        {name: "NOM_ABR", title: "Nombre abreviatura", required: true, type: "string"},
        {name: "PTOT", title: "Población total", required: false, type: "int"},
        {name: "PMAS", title: "Población masculina", required: false, type: "int"},
        {name: "PFEM", title: "Población femenina", required: false, type: "int"}
    ]
};
eng.dataSources["Municipality"] = {
    scls: "Municipality",
    modelid: DBModel,
    dataStore: "mongodb",
    displayField: "NOM_MUN",
    fields: [
        {name: "NOM_MUN", title: "Municipio", required: true, type: "string"},
        {name: "CVE_MUN", title: "Clave", required: true, type: "string"},
        {name: "CVE_ENT", title: "Clave estado", required: true, type: "string"},
        {name: "PTOT", title: "Población total", required: false, type: "int"},
        {name: "PMAS", title: "Población masculina", required: false, type: "int"},
        {name: "PFEM", title: "Población femenina", required: false, type: "int"}
    ]
};
eng.dataSources["Locality"] = {
    scls: "Locality",
    modelid: DBModel,
    dataStore: "mongodb",
    displayField: "NOM_LOC",
    fields: [
        {name: "NOM_LOC", title: "Municipio", required: true, type: "string"},
        {name: "CVE_LOC", title: "Clave", required: true, type: "string"},
        {name: "CVE_MUN", title: "Clave municipio", required: true, type: "string"},
        {name: "CVE_ENT", title: "Clave estado", required: true, type: "string"},
        {name: "LATITUD", title: "Latitud", required: true, type: "double"},
        {name: "LONGITUD", title: "Longitud", required: true, type: "double"},
        {name: "ALTITUD", title: "Altitud", required: false, type: "double"},
        {name: "PTOT", title: "Población total", required: false, type: "int"},
        {name: "PMAS", title: "Población masculina", required: false, type: "int"},
        {name: "PFEM", title: "Población femenina", required: false, type: "int"}
    ]
};
eng.dataSources["DSEndpoint"] = {
    scls: "DSEndpoint",
    modelid: DBModel,
    dataStore: "mongodb",
    displayField: "name",
    fields: [
        {name: "name", title: "Nombre", required: true, type: "string"},
        {name:"resourceName", title:"Recurso", type:"String", required: true},
        {name:"datasourceName", title:"DataSource", type:"String", required: true},
        {name:"enabled", title:"Habilitado", type:"boolean", required: false},
        {name:"restrictionType", title:"Restricción", type:"string", required: true}
    ]
};
eng.dataSources["GeoLayer"] = {
    scls: "GeoLayer",
    modelid: DBModel,
    dataStore: "mongodb",
    displayField: "name",
    fields: [
        {name:"name", title: "Nombre", required: true, type: "string"},
        {name:"type", title: "Tipo", required: true, type: "string"},
        {name:"file", title:"Archivo", type:"String", required: true}
    ]
};

eng.dataSources["Dashboard"] = {
    scls: "Dashboard",
    modelid: DBModel,
    dataStore: "mongodb",
    displayField: "name",
    fields: [
        {name:"name", title: "Nombre", required: true, type: "string"}
        //{name:"widgets", title:"Widgets", type:"boolean", required: false}
    ]
};

eng.dataSources["Extractor"] = {
  scls: "Extractor",
  modelid: DBModel,
  dataStore: "mongodb",
  displayField: "name",
  fields: [
      {name:"name", title: "Nombre", required: true, type: "string"}, //Nombre descriptivo
      {name:"description", title: "Descripción", required: true, type: "string"}, //Descripción del extractor
      {name:"class", title: "Tipo", required: true, type: "string"}, //Nombre de la clase a instanciar
      {name:"periodic", title:"Periodico", type:"boolean"}, //Indica si es periódica su ejecución
      {name:"timer", title:"Tiempo", type:"int"}, //Tiempo para la ejecución, ej. 30
      {name:"unit", title:"Unidad de tiempo", type:"string"}, //Unidad de tiempo: h|d|m (horas, días, meses)
      {name:"dataSource", title:"DataSource", type:"string"}, //Nombre del datasource a escribir
      {name:"fileLocation", title:"Ubicación", type:"string"}, //Ubicación remota del recurso
      {name:"zipped", title:"ZIP", type:"boolean"}, //Indica si el recurso está comprimido
      {name:"zipPath", title:"ruta", type:"string"}, //Ubicación del recurso dentro del ZIP
      {name:"charset", title:"charset", type:"string"}, //Codificación de caracteres del recurso
      {name:"columns", title:"mapeo", type:"boolean"}, //Mapeo de columnas del datasource
      {name:"overwrite", title:"sobreescribir", type:"boolean"}, //Indica si se sobreescribirán los datos
      {name:"lastExecution", title:"Ultima ejecución", type:"string"} //Fecha de última ejecución
  ]
};

eng.dataSources["Widget"] = {
    scls: "Widget",
    modelid: DBModel,
    dataStore: "mongodb",
    displayField: "name",
    fields: [
        {name:"name", title: "Nombre", required: true, type: "string"},
        {name:"type", title: "Tipo", required: true, type: "string"},
        {name:"col", title: "Columna", required: true, type: "int"},
        {name:"row", title: "Fila", required: true, type: "int"},
        {name:"sizeX", title: "Tamaño X", required: true, type: "int"},
        {name:"sizeY", title: "Tamaño Y", required: true, type: "int"}
    ]
};


/*
eng.dataExtractors["StateExtractor"] = {
  timer: { time: 30, unit: "d" },
  dataSource: "State",
  fileLocation: "http://geoweb.inegi.org.mx/mgn2kData/catalogos/cat_entidad_ENE2016.zip",
  zipped: true,
  zipPath: "/cat_entidad_ENE2016.dbf",
  charset: "ISO-8859-1",
  overwrite: true,
  class: "org.fst2015pm.swbforms.extractors.DBFExtractor",
  columns: [
    { src:"NOM_ENT", type:"string" },
    { src:"CVE_ENT", type:"string" },
    { src:"NOM_ABR", type:"string" },
    { src:"PTOT", type:"int" },
    { src:"PMAS", type:"int" },
    { src:"PFEM", type:"int" }
  ]
};

eng.dataExtractors["MunicipalityExtractor"] = {
  timer: { time: 30, unit: "d" },
  dataSource: "Municipality",
  fileLocation: "http://geoweb.inegi.org.mx/mgn2kData/catalogos/cat_municipio_OCT2016.zip",
  zipped: true,
  zipPath: "/cat_municipio_OCT2016.dbf",
  charset: "ISO-8859-1",
  overwrite: true,
  class: "org.fst2015pm.swbforms.extractors.DBFExtractor",
  columns: [
    { src:"NOM_MUN", type:"string" },
    { src:"CVE_MUN", type:"string" },
    { src:"CVE_ENT", type:"string" },
    { src:"PTOT", type:"int" },
    { src:"PMAS", type:"int" },
    { src:"PFEM", type:"int" }
  ]
};

eng.dataExtractors["LocalityExtractor"] = {
  timer: { time: 30, unit: "d" },
  dataSource: "Locality",
  fileLocation: "http://geoweb.inegi.org.mx/mgn2kData/catalogos/cat_localidad_DIC2016.zip",
  zipped: true,
  zipPath: "/cat_localidad_DIC2016.dbf",
  charset: "ISO-8859-1",
  overwrite: true,
  class: "org.fst2015pm.swbforms.extractors.DBFExtractor",
  columns: [
    {src:"NOM_LOC", type:"string"},
    {src:"CVE_LOC", type:"string"},
    {src:"CVE_MUN", type:"string"},
    {src:"CVE_ENT", type:"string"},
    {src:"LATITUD", dest:"LAT", type:"double"},
    {src:"LONGITUD", dest: "LON", type:"double"},
    {src:"PTOT", type:"int"},
    {src:"PMAS", type:"int"},
    {src:"PFEM", type:"int"}
  ]
};*/
