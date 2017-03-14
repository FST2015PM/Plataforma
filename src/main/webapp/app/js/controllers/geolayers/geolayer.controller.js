(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("GeolayerCtrl", GeolayerCtrl);

    GeolayerCtrl.$inject = ["$Datasource"];
    function GeolayerCtrl($Datasource) {
      let cnt = this;
      cnt.layerList = [];

      $Datasource.listObjects("GeoLayer")
      .then(res => {
        if (res.data.data && res.data.data.length) {
          cnt.layerList = res.data.data;
        }
      });
    }

})()
