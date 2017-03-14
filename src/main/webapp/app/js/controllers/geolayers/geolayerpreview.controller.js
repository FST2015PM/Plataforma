(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("GeolayerPreviewCtrl", GeolayerPreviewCtrl);

    GeolayerPreviewCtrl.$inject = ["$Datasource", "$stateParams", "$http", "$timeout"];
    function GeolayerPreviewCtrl($Datasource, $stateParams, $http, $timeout) {
      let cnt = this;
      let df = [40.46, -100.715];
      cnt.layerData = {};

      $timeout(() => {
          cnt.map = dataviz.mapsFactory.createMap("previewMap", ENGINE_LEAFLET, df, 3);
      });

      if ($stateParams.id && $stateParams.id.length) {
        $Datasource.getObject($stateParams.id, "GeoLayer").then(layer => {
          cnt.layerData = layer.data;
          $http({
            url: `/app/geolayers/${cnt.layerData.file}`,
            method: "GET"
          }).then(res => {
            dataviz.mapsFactory.addGeoJSONLayer(cnt.map, res.data, ENGINE_LEAFLET);
          });
        });
      }

    }

})()
