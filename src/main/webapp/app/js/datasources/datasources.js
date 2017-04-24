
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
