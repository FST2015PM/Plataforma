(function() {
    'use strict';

    angular
        .module('FST2015PM.controllers')
        .controller('MapsCtrl', MapsCtrl);

    MapsCtrl.$inject = ['$scope', '$http'];
    function MapsCtrl($scope, $http) {
        //LEAFLET
        var mochis = [25.793, -108.977];
        var df = [ 19.419444, -99.14555 ];
        var datosMun;

        var leaf = dataviz.mapsFactory.createMap("map1",ENGINE_LEAFLET_DUAL, df, 10);
        var mp2 = dataviz.mapsFactory.createMap("map3",ENGINE_LEAFLET_DUAL, df,5 );
        var googleMap = dataviz.mapsFactory.createMap("map", ENGINE_GOOGLEMAPS, mochis,10);
        var leaf2 = dataviz.mapsFactory.createMap("mapButt",ENGINE_LEAFLET, df, 10);
        var Hmap = dataviz.mapsFactory.createMap("hMap",ENGINE_LEAFLET, df, 10);

        /*  $http({
            url: "/app/mockdata/geo/PM_15_municipio.geojson",
            method: "GET"
          }).then((res) => {
            dataviz.mapsFactory.addGeoJSONLayer(Hmap, res.data,ENGINE_LEAFLET );
          });*/
        $http({
            url: "/app/mockdata/shape/uni.geojson",
            method: "GET"
        }).then(function(res) {
            dataviz.mapsFactory.addGeoJSONLayer(Hmap, res.data,ENGINE_LEAFLET );
        });
        $http({
            url: "/app/mockdata/datMun.csv",
            method: "GET"
        }).then(function(res) {
            dataviz.mapsFactory.addGeoJSONLayerCVS(Hmap, res.data );
        });

        dataviz.mapsFactory.addControls(leaf2, 'topright', 'prueba', 'PRUEBAS');
        dataviz.mapsFactory.addSimpleMarker(df, mp2);

        $http({
            url: "/app/mockdata/geo/PM_15_municipio.geojson",
            method: "GET"
        }).then(function(res) {
            //  console.log(res.data);
            var datosMun = res.data;
            dataviz.mapsFactory.addGeoJSONLayer(leaf, res.data, ENGINE_LEAFLET);
            dataviz.mapsFactory.addGeoJSONLayer(googleMap, res.data, ENGINE_GOOGLEMAPS);


            document.getElementById("prueba").addEventListener ("click", function() {
                var dataOnMaps;
                if (this.checked){
                    dataOnMaps = dataviz.mapsFactory.addGeoJSONLayer(leaf2, res.data, ENGINE_LEAFLET);
                } else {
                    dataviz.mapsFactory.quitGeoJson(dataOnMaps);
                }
            }, false);
        });


        $http({
            url: "/app/mockdata/geo/PM_15_puntos_complem.geojson",
            method: "GET"
        }).then(function(res) {
            dataviz.mapsFactory.addCircleMarker(mp2, res.data);
            dataviz.mapsFactory.addGeoJSONLayer(mp2, res.data,ENGINE_LEAFLET );
            dataviz.mapsFactory.addGeoJSONLayer(googleMap, res.data, ENGINE_GOOGLEMAPS);
        });

        $http({
            url: "/app/mockdata/geo/PM_15_puntos_complem.geojson",
            method: "GET"
        }).then(function(res) {
            dataviz.mapsFactory.addMarker(leaf, res.data, ENGINE_LEAFLET);
        });

        //Google Maps
        /*
        Direction for google maps
        DRIVING
        BICYCLING
        TRANSIT
        WALKING
      */
        var cu = {lat: 19.3216466, lng: -99.202668};
        var ipnTurismo = {lat: 19.514384, lng: -99.140244};

        dataviz.mapsFactory.addRoute(googleMap, ipnTurismo, cu, 'DRIVING', ENGINE_GOOGLEMAPS);

        var market2 = {lat: 19.515260, lng: -99.142244};
        var market3 = {lat: 19.51136, lng: -99.13800};


        dataviz.mapsFactory.addRoute(googleMap, market2, 'Pabellón lindavista', ENGINE_GOOGLEMAPS);
        dataviz.mapsFactory.addRoute(googleMap, market3, 'Escuela nacional de turismo', ENGINE_GOOGLEMAPS);

    }
})();
