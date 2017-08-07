(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("EndpointEditCtrl", EndpointEditCtrl);

  EndpointEditCtrl.$inject = ["$Datasource", "$stateParams", "$state", "toaster"];
  function EndpointEditCtrl($Datasource, $stateParams, $state, toaster) {
    let cnt = this;
    cnt.formTitle = "Agregar Punto de acceso";
    cnt.dsList = [];
    cnt.endpointData = {};
    cnt.processing = false;

    if($stateParams.id && $stateParams.id.length) {
      cnt.formTitle = "Editar Punto de acceso";
      $Datasource.getObject($stateParams.id, "DSEndpoint")
      .then(function(ds) {
        cnt.endpointData = ds.data;
      });
    }

    $Datasource.listDatasources()
    .then(function(res) {
      if (res.data && res.data.length) {
        cnt.dsList = res.data;

        $Datasource.listEndpoints()
        .then(function(result) {
          if (result.data && result.data.data) {
            result.data.data.forEach(function(elem) {
              let idx = cnt.dsList.indexOf(elem.dataSourceName);
              if (idx > -1) {
                cnt.dsList.splice(idx, 1);
              }
            });
            if($stateParams.id && $stateParams.id.length) {
              cnt.dsList.push(cnt.endpointData.dataSourceName);
            }
          }
        });
      }
    });

    cnt.submitForm = function(form) {
      if (form.$valid) {
        cnt.processing = true;
        if (!cnt.endpointData._id) {
          $Datasource.addObject(cnt.endpointData, "DSEndpoint")
          .then(function(response) {
            toaster.pop({
              type: 'success',
              body: 'Se ha agregado el nuevo punto de acceso',
              showCloseButton: true,
            });
            $state.go('admin.endpoints', {});
          })
        } else {
          $Datasource.updateObject(cnt.endpointData, "DSEndpoint")
          .then(function(response) {
            toaster.pop({
              type: 'success',
              body: 'Se ha actualizado el punto de acceso',
              showCloseButton: true,
            });
            $state.go('admin.endpoints', {});
          })
        }
      }
    };

  }

})();
