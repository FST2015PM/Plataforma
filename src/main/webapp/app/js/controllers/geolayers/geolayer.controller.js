(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("GeolayerCtrl", GeolayerCtrl);

    GeolayerCtrl.$inject = ["$GeoLayer", "$timeout", "toaster"];
    function GeolayerCtrl($GeoLayer, $timeout, toaster) {
      let cnt = this;
      cnt.layerList = [];

      $GeoLayer.listGeoLayers()
      .then(function(res) {
        if (res.data && res.data.length) {
          cnt.layerList = res.data;

          $timeout(function() {
            $('a[rel=popover]').popover({
              html: 'true',
              placement: 'left'
            });
          });
        }
      });

      cnt.deleteLayer = function(id) {
        bootbox.confirm({
          message: "<h4>Esta capa será eliminada permanentemente.<br>¿Desea continuar?</h4>",
          buttons: {
            cancel: {
              label: "Cancelar"
            },
            confirm: {
              label: "Aceptar"
            }
          },
          callback: function(result) {
            if (result) {
              $GeoLayer.removeGeoLayer(id)
              .then(function(result) {
                cnt.layerList.filter(function(elem, i) {
                  if (elem._id === id) {
                    cnt.layerList.splice(i, 1);
                  }
                });
              });

              toaster.pop({
                type: 'success',
                body: 'Se ha eliminado la capa',
                showCloseButton: true,
              });
            }
          }
        });
      };

    }

})()
