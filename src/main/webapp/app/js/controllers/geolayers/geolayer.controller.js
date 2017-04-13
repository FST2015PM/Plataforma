(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("GeolayerCtrl", GeolayerCtrl);

    GeolayerCtrl.$inject = ["$GeoLayer"];
    function GeolayerCtrl($GeoLayer) {
      let cnt = this;
      cnt.layerList = [];

      $GeoLayer.listGeoLayers()
      .then(res => {
        console.log(res);
        if (res.data && res.data.length) {
          cnt.layerList = res.data;
        }
      });

      cnt.deleteLayer = function(id) {
        bootbox.confirm("<h3>Esta capa será eliminada permanentemente. \n ¿Deseas continuar?</h3>", result => {
          if (result) {
            $GeoLayer.removeGeoLayer(id)
            .then(result => {
              cnt.layerList.filter((elem, i) => {
                if (elem._id === id) {
                  cnt.layerList.splice(i, 1);
                }
              });
            });
          }
        });
      };
    }

})()
