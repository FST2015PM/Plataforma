(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("GeolayerEditCtrl", GeolayerEditCtrl);

    GeolayerEditCtrl.$inject = ["$GeoLayer", "$stateParams", "$state"];
    function GeolayerEditCtrl($GeoLayer, $stateParams, $state) {
      let cnt = this;
      cnt.formTitle = "Agregar capa";

      if ($stateParams.id && $stateParams.id.length) {
        cnt.formTitle = "Editar capa";
        $GeoLayer.getGeoLayer($stateParams.id).then(layer => {
          cnt.layerData = layer.data;
        });
      }

      cnt.submitForm = function(form) {
        if (form.$valid) {
          if (!cnt.layerData._id) {
            //Invoke service to get file and transform it to geoJSON
            $GeoLayer.addGeoLayer(cnt.layerData)
            .then(response => {
              $state.go('admin.geolayers', {});
            })
          } else {
            $GeoLayer.updateGeoLayer(cnt.layerData)
            .then(response => {
              $state.go('admin.geolayers', {});
            })
          }
        }
      };

    }

})()
