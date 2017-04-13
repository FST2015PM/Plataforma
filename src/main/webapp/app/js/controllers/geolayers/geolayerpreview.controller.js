(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("GeolayerPreviewCtrl", GeolayerPreviewCtrl);

    GeolayerPreviewCtrl.$inject = ["$GeoLayer", "$stateParams", "$http", "$timeout"];
    function GeolayerPreviewCtrl($GeoLayer, $stateParams, $http, $timeout) {
      let cnt = this;
      let df = [40.46, -100.715];
      cnt.layerData = {};

      $timeout(() => {
          cnt.map = dataviz.mapsFactory.createMap("previewMap", ENGINE_LEAFLET, df, 3);
      });

      if ($stateParams.id && $stateParams.id.length) {
        $GeoLayer.getGeoLayer($stateParams.id).then(layer => {
          cnt.layerData = layer.data;
          let fId = "";

          if (cnt.layerData._id.length && cnt.layerData._id.lastIndexOf(":") > -1) {
            fId = cnt.layerData._id.substring(cnt.layerData._id.lastIndexOf(":") + 1, cnt.layerData._id.length);
          }

          if(cnt.layerData.type === "kml") {
            fId = "/public/geolayers/" + fId + ".kml";

            $http({
              url: fId,
              method: "GET"
            }).then((response) => {
              if (response.status === 200) {
                //console.log(response.data);
                //let parser = new DOMParser();
                //let dom = parser.parseFromString(response.data, "text/xml");
                //console.log(dom);
                //console.log("---");
                //console.log(toGeoJSON.kml(dom));
                  dataviz.mapsFactory.addKMLLayer(cnt.map, response.data, ENGINE_LEAFLET);
              }
            }).catch((error) => {
              console.log(error);
            });
            //dataviz.mapsFactory.addKMLLayer(cnt.map, fId, ENGINE_LEAFLET);
          } else {
            fId = "/public/geolayers/" + fId + ".geojson";
            $http({
              url: fId,
              method: "GET"
            }).then((response) => {
              if (response.status === 200) {
                  dataviz.mapsFactory.addGeoJSONLayer(cnt.map, response.data, ENGINE_LEAFLET);
              }
            }).catch((error) => {
              console.log(error);
            });
          }

        });
      }

    }

})()
