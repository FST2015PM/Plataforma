(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("ApiKeyEditCtrl", ApiKeyEditCtrl);

  ApiKeyEditCtrl.$inject = ["$Datasource", "$APIKey", "$stateParams", "$state", "toaster"];
  function ApiKeyEditCtrl($Datasource, $APIKey, $stateParams, $state, toaster) {
    let cnt = this;
    cnt.formTitle = "Agregar Llave API";
    cnt.apiKeyData = {};
    cnt.processing = false;

    if($stateParams.id && $stateParams.id.length) {
      cnt.formTitle = "Editar Llave API";
      $Datasource.getObject($stateParams.id, "APIKey")
      .then(function(ds) {
        cnt.apiKeyData = ds.data;
      });
    }

    cnt.submitForm = function(form) {
      if (form.$valid) {
        cnt.processing = true;
        if (!cnt.apiKeyData._id) {
          $APIKey.createAPIKey(cnt.apiKeyData)
          .then(function(response) {
            toaster.pop({
              type: 'success',
              body: 'Se ha agregado la nueva llave API',
              showCloseButton: true,
            });
            $state.go('admin.apikeys', {});
          })
        }
      }
    };

  }

})();
