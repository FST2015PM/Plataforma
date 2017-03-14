(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("GeolayerEditCtrl", GeolayerEditCtrl);

    GeolayerEditCtrl.$inject = ["$Datasource", "$stateParams", "$state"];
    function GeolayerEditCtrl($Datasource, $stateParams, $state) {
      let cnt = this;
      cnt.formTitle = "Agregar capa";

      if ($stateParams.id && $stateParams.id.length) {
        cnt.formTitle = "Editar capa";
        $Datasource.getObject($stateParams.id, "GeoLayer").then(layer => {
          cnt.layerData = layer.data;
        });
      }

      cnt.submitForm = function(form) {
        if (form.$valid) {
          if (!cnt.layerData._id) {
            $Datasource.addObject(cnt.layerData, "GeoLayer")
            .then(response => {
              $state.go('admin.geolayers', {});
            })
          } else {
            $Datasource.updateObject(cnt.layerData, "GeoLayer")
            .then(response => {
              $state.go('admin.geolayers', {});
            })
          }
        }
      };

    }

})()
