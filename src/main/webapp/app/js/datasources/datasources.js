var DBModel = "FST2015PM";

eng.userSessionConfig = {
  sessTime: 21600 //Session time for App services (15 days)
};

eng.dataSources["MagicTown"] = {
    scls: "MagicTown",
    modelid: DBModel,
    dataStore: "mongodb",
    displayField: "name",
    ontCategory: "",
    fields: [
        {name:"CVE_ENT", title:"Clave de Estado", type:"string", required: true},
        {name:"CVE_MUN", title:"Clave de Municipio", type:"string", required: true},
        {name:"CVE_LOC", title:"Clave de Localidad", type:"string", required: true},
        {name:"CVE_MTW", title:"Clave Geo", type:"string", required: true},
        {name:"name", title: "Nombre", required: true, type: "string"},
        {name:"denomination", title: "Denominación", required: false, type: "string"},
        {name:"description", title: "Descripción", required: true, type: "string"},
        {name:"accepted", title:"Incorporado", type:"boolean"},
        {name:"inclusion_date", title:"Fecha de incorporación", type: "date"},
        {name:"foundation_date", title:"Fecha de fundación", type: "date"},
        {name:"origin", title: "Origen", type: "string"},
        {name:"location", title: "Ubicación", type: "string"},
        {name:"ethnic_name", title: "Nombre indígena", type: "string"},
        {name:"attractives", title: "Atractivos turísticos", required: true, type: "string"},
        {name:"festivities", title: "Festividades", type: "string"},
        {name:"picture", title: "Imagen", type: "image"}
    ]
};
eng.dataSources["State"] = {
    scls: "State",
    modelid: DBModel,
    dataStore: "mongodb",
    displayField: "NOM_ENT",
    ontCategory: "",
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
    ontCategory: "",
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
    ontCategory: "",
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
        {name:"description", title: "Descripción", required: true, type: "string"},
        {name:"type", title: "Tipo", required: true, type: "string"},
        {name:"fileLocation", title:"Ubicación", required: true, type:"string"}, //Ubicación remota del recurso
        {name:"zipped", title:"ZIP", type:"boolean"}, //Indica si el recurso está comprimido
        {name:"zipPath", title:"ruta", type:"string"}, //Ubicación del recurso dentro del ZIP
        {name:"resourceURL", title:"URL del recurso", type:"string"}
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
      {name:"dataSource", title:"DataSource", required: true, type:"string"}, //Nombre del datasource a escribir
      {name:"fileLocation", title:"Ubicación", required: true, type:"string"}, //Ubicación remota del recurso
      {name:"zipped", title:"ZIP", type:"boolean"}, //Indica si el recurso está comprimido
      {name:"zipPath", title:"ruta", type:"string"}, //Ubicación del recurso dentro del ZIP
      {name:"charset", title:"charset", required: true, type:"string"}, //Codificación de caracteres del recurso
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

eng.dataSources["Market"] = {
  scls: "Market",
  modelid: DBModel,
  dataStore: "mongodb",
  displayField: "name",
  ontCategory: "",
  fields: [
    {name: "loc", title: "Ubicación", required: true, type: "boolean"},
    {name: "name", title:"Nombre", required: true, type: "string"},
    {name: "type", title: "Tipo", required: true, type : "string"},
    {name: "description", title: "Descripción", required: true, type:"string"},
    {name: "created", title:"Creado", required:false, type:"date"},
    {name: "shopNumber", title: "Locales", required:false, type:"int"},
    {name: "serviceDays", title: "Días de servicio", required: false, type:"boolean"},
    {name: "serviceHours", title:"Horas de servicio", required:false, type:"boolean"},
    {name: "image", title: "Fotografía", required: false, type:"boolean"}
  ]
};

eng.dataSources["Parking"] = {
  scls: "Parking",
  modelid: DBModel,
  dataStore: "mongodb",
  displayField: "name",
  ontCategory: "",
  fields: [
    {name: "loc", title: "Ubicación", required: true, type: "boolean"},
    {name: "name", title:"Nombre", required: true, type: "string"},
    {name: "fee", title:"Cuota", required:false, type:"double"},
    {name: "freeTime", title: "Tiempo libre", required: false, type:"boolean"},
    {name: "is24h", title: "24 horas", required: false, type:"boolean"},
    {name: "isFormal", title: "Formal", required: false, type:"boolean"},
    {name: "isSelfService", title: "Autoservicio", required: false, type:"boolean"},
    {name: "carCapacity", title: "Capacidad", required:false, type:"int"},
    {name: "contact", title:"Datos de contacto", required: true, type: "string"},
    {name: "amenities", title:"Datos de contacto", required: false, type: "string"},
    {name: "serviceDays", title: "Días de servicio", required: false, type:"boolean"},
    {name: "serviceHours", title:"Horas de servicio", required:false, type:"boolean"},
    {name: "image", title: "Fotografía", required: false, type:"boolean"}
  ]
};

eng.dataSources["TourismSignal"] = {
  scls: "TourismSignal",
  modelid: DBModel,
  dataStore: "mongodb",
  displayField: "type",
  ontCategory: "",
  fields: [
    {name: "loc", title: "Ubicación", required: true, type: "boolean"},
    {name: "type", title: "Tipo", required: true, type : "string"},
    {name: "position", title: "Posición", required: true, type : "string"},
    {name: "visible", title: "Visible", required: true, type : "string"},
    {name: "image", title: "Fotografía", required: false, type:"boolean"}
  ]
};

eng.dataSources["ATM"] = {
  scls: "ATM",
  modelid: DBModel,
  dataStore: "mongodb",
  displayField: "bank",
  ontCategory: "",
  fields: [
    {name: "loc", title: "Ubicación", required: true, type: "boolean"},
    {name: "bank", title: "Banco", required: true, type : "string"},
    {name: "atmUnits", title: "Unidades", required: true, type : "int"},
    {name: "inService", title: "En servicio", required: false, type:"boolean"}
  ]
};

eng.dataSources["TravelAgency"] = {
  scls: "TravelAgency",
  modelid: DBModel,
  dataStore: "mongodb",
  displayField: "name",
  ontCategory: "",
  fields: [
    {name: "name", title: "Nombre", required: true, type : "string"},
    {name: "loc", title: "Ubicación", required: true, type: "boolean"},
    {name: "type", title: "Tipo", required: true, type : "string"},
    {name: "address", title:"Dirección", required: true, type: "string"},
    {name: "contact", title:"Datos de contacto", required: true, type: "string"},
    {name: "products", title: "Productos", required: true, type : "string"},
    {name: "serviceDays", title: "Días de servicio", required: false, type:"boolean"},
    {name: "serviceHours", title:"Horas de servicio", required:false, type:"boolean"}
  ]
};

eng.dataSources["ConferenceOffice"] = {
  scls: "ConferenceOffice",
  modelid: DBModel,
  dataStore: "mongodb",
  displayField: "name",
  ontCategory: "",
  fields: [
    {name: "name", title: "Nombre", required: true, type : "string"},
    {name: "loc", title: "Ubicación", required: true, type: "boolean"},
    {name: "contact", title:"Datos de contacto", required: true, type: "string"},
    {name: "manager", title: "Administrador", required: true, type : "string"},
    {name: "image", title: "Fotografía", required: false, type:"boolean"}
  ]
};

eng.dataSources["WifiHotSpot"] = {
  scls: "WifiHotSpot",
  modelid: DBModel,
  dataStore: "mongodb",
  displayField: "type",
  ontCategory: "",
  fields: [
    {name: "loc", title: "Ubicación", required: true, type: "boolean"},
    {name: "provider", title: "Banco", required: true, type : "string"},
    {name: "upSpeed", title: "Unidades", required: true, type : "int"},
    {name: "downSpeed", title: "Unidades", required: true, type : "int"},
    {name: "accesType", title: "Banco", required: true, type : "string"},
    {name: "inService", title: "En servicio", required: false, type:"boolean"}
  ]
};

eng.dataSources["UndergroundWiring"] = {
  scls: "UndergroundWiring",
  modelid: DBModel,
  dataStore: "mongodb",
  displayField: "type",
  ontCategory: "",
  fields: [
    {name: "loc", title: "Ubicación", required: true, type: "boolean"},
    {name: "type", title: "Tipo", required: true, type : "string"}
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
