(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("DSCtrl", DSCtrl);

  DSCtrl.$inject = ["$Datasource", "toaster"];
  function DSCtrl($Datasource, toaster) {
    let cnt = this;
    cnt.dsList = [];

    $Datasource.listObjects("DBDataSource")
    .then(function(res) {
      if (res.data.data && res.data.data.length) {
        cnt.dsList = res.data.data;
      }
    });

    cnt.deleteDS = function(id) {
      bootbox.confirm({
        message: "<h4>Este conjunto de datos será eliminado permanentemente y los objetos asociados dejarán de funcionar. <br>¿Desea continuar?</h4>",
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
            $Datasource.removeObject(id, "DBDataSource")
            .then(function(result) {
              cnt.dsList.filter(function(elem, i) {
                if (elem._id === id) {
                  cnt.dsList.splice(i, 1);
                }
              });
              $Datasource.updateDBSources();
            });

            toaster.pop({
              type: 'success',
              body: 'Se ha eliminado el conjunto de datos',
              showCloseButton: true,
            });
          }
        }
      });
    };

  }

})();
