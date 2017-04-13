let dataviz = window.dataviz || (function () {
  let mod = {version:"1.0.0"};

  if (typeof ChartsFactory === "function") mod.chartsFactory = new ChartsFactory();
  if (typeof MapsFactory === "function") mod.mapsFactory = new MapsFactory();
  if (typeof DataTablesFactory === "function") mod.dataTablesFactory = new DataTablesFactory();

  return mod;
})();
