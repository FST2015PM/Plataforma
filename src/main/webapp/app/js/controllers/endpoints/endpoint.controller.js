(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("EndpointCtrl", EndpointCtrl);

  EndpointCtrl.$inject = ["$Datasource"];
  function EndpointCtrl($Datasource) {
    let cnt = this;
    cnt.dsList = [];

    $Datasource.listObjects("DSEndpoint")
    .then(res => {
      if (res.data.data && res.data.data.length) {
        cnt.dsList = res.data.data;
      }
    });

    cnt.deleteEndPoint = function(id) {
      bootbox.confirm("<h3>Este endpoint será eliminado permanentemente. \n ¿Deseas continuar?</h3>", result => {
        if (result) {
          $Datasource.removeObject(id, "DSEndpoint")
          .then(result => {
            cnt.dsList.filter((elem, i) => {
              if (elem._id === id) {
                cnt.dsList.splice(i, 1);
              }
            });
          });
        }
      });
    };

  }

})();
