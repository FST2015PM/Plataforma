(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("GeolayerEditCtrl", GeolayerEditCtrl);

    GeolayerEditCtrl.$inject = ["$GeoLayer", "$stateParams", "$state", "toaster"];
    function GeolayerEditCtrl($GeoLayer, $stateParams, $state, toaster) {
      let cnt = this;
      cnt.formTitle = "Agregar capa";
      cnt.processing = false;

      if ($stateParams.id && $stateParams.id.length) {
        cnt.formTitle = "Editar capa";
        $GeoLayer.getGeoLayer($stateParams.id).then(function(layer) {
          cnt.layerData = layer.data;
        });
      }

      cnt.submitForm = function(form) {
        if (form.$valid) {
          cnt.processing = true;
          if (!cnt.layerData._id) {
            //Invoke service to get file and transform it to geoJSON
            $GeoLayer.addGeoLayer(cnt.layerData)
            .then(function(response) {
              toaster.pop({
                type: 'success',
                body: 'Se ha agregado la nueva capa',
                showCloseButton: true,
              });
              $state.go('admin.geolayers', {});
            })
          } else {
            $GeoLayer.updateGeoLayer(cnt.layerData)
            .then(function(response) {
              toaster.pop({
                type: 'success',
                body: 'Se ha modificado la capa',
                showCloseButton: true,
              });
              $state.go('admin.geolayers', {});
            })
          }
        }
      };

    }

})()
