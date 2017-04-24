(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("DSCtrl", DSCtrl);

  DSCtrl.$inject = ["$Datasource"];
  function DSCtrl($Datasource) {
    let cnt = this;
    cnt.dsList = [];

    $Datasource.listObjects("DBDataSource")
    .then(res => {
      if (res.data.data && res.data.data.length) {
        cnt.dsList = res.data.data;
      }
    });

    cnt.deleteDS = function(id) {
      bootbox.confirm("<h3>Este conjunto será eliminado permanentemente y los objetos asociados dejarán de funcionar. \n ¿Deseas continuar?</h3>", result => {
        if (result) {
          $Datasource.removeObject(id, "DBDataSource")
          .then(result => {
            cnt.dsList.filter((elem, i) => {
              if (elem._id === id) {
                cnt.dsList.splice(i, 1);
              }
            });
            $Datasource.updateDBSources();
          });
        }
      });
    };

  }

})();
