(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("ApiKeyCtrl", ApiKeyCtrl);

  ApiKeyCtrl.$inject = ["$APIKey", "$Datasource", "toaster"];
  function ApiKeyCtrl($APIKey, $Datasource, toaster) {
    let cnt = this;
    cnt.apiKeys = [];

    $Datasource.listObjects("APIKey")
    .then(function(res) {
      if (res.data.data && res.data.data.length) {
        cnt.apiKeys = res.data.data;
      }
    });

    cnt.deleteApiKey = function(id) {
      bootbox.confirm({
        message: "<h4>Esta llave API será eliminada permanentemente.<br>¿Desea continuar?</h4>",
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
            $APIKey.revokeAPIKey(id)
            .then(function(result) {
              cnt.apiKeys.filter(function(elem, i) {
                if (elem._id === id) {
                  cnt.apiKeys.splice(i, 1);
                }
              });
            });

            toaster.pop({
              type: 'success',
              body: 'Se ha eliminado la llave API',
              showCloseButton: true,
            });
          }
        }
      });

    };

  }

})();
