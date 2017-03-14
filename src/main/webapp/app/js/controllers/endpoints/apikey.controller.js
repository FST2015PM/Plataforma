(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("ApiKeyCtrl", ApiKeyCtrl);

  ApiKeyCtrl.$inject = ["$APIKey", "$Datasource"];
  function ApiKeyCtrl($APIKey, $Datasource) {
    let cnt = this;
    cnt.apiKeys = [];

    $Datasource.listObjects("APIKey")
    .then(res => {
      if (res.data.data && res.data.data.length) {
        cnt.apiKeys = res.data.data;
      }
    });

    cnt.deleteApiKey = function(id) {
      bootbox.confirm("<h3>Al eliminar las llaves, la aplicación asociada dejará de funcionar. \n ¿Desea continuar?</h3>", result => {
        if (result) {
          $APIKey.revokeAPIKey(id)
          .then(result => {
            cnt.apiKeys.filter((elem, i) => {
              if (elem._id === id) {
                cnt.apiKeys.splice(i, 1);
              }
            });
          });
        }
      });
    };

  }

})();
