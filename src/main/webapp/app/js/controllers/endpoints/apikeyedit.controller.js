(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("ApiKeyEditCtrl", ApiKeyEditCtrl);

  ApiKeyEditCtrl.$inject = ["$Datasource", "$APIKey", "$stateParams", "$state"];
  function ApiKeyEditCtrl($Datasource, $APIKey, $stateParams, $state) {
    let cnt = this;
    cnt.formTitle = "Agregar API";
    cnt.apiKeyData = {};

    if($stateParams.id && $stateParams.id.length) {
      cnt.formTitle = "Editar API";
      $Datasource.getObject($stateParams.id, "APIKey").then(ds => {
        cnt.apiKeyData = ds.data;
      });
    }

    cnt.submitForm = function(form) {
      if (form.$valid) {
        if (!cnt.apiKeyData._id) {
          $APIKey.createAPIKey(cnt.apiKeyData)
          .then(response => {
            $state.go('admin.apikeys', {});
          })
        }
      }
    };

  }

})();
