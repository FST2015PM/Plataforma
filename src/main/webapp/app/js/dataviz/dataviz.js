var dataviz = (function () {
    var mod = {version:"1.0.0"};

    if (typeof ChartsFactory === "function") mod.chartsFactory = new ChartsFactory();
    if (typeof MapsFactory === "function") mod.mapsFactory = new MapsFactory();
    if (typeof DataTablesFactory === "function") mod.dataTablesFactory = new DataTablesFactory();
    if (typeof GraphsFactory === "function") mod.graphsFactory = new GraphsFactory();

    return mod;
})();

if (typeof module !== 'undefined') module.exports = dataviz;
