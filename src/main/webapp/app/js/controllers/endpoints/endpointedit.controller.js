(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("EndpointEditCtrl", EndpointEditCtrl);

  EndpointEditCtrl.$inject = ["$Datasource", "$stateParams", "$state"];
  function EndpointEditCtrl($Datasource, $stateParams, $state) {
    let cnt = this;
    cnt.formTitle = "Agregar EndPoint";
    cnt.dsList = [];
    cnt.endpointData = {};
    cnt.processing = false;

    if($stateParams.id && $stateParams.id.length) {
      cnt.formTitle = "Editar EndPoint";
      $Datasource.getObject($stateParams.id, "DSEndpoint").then(ds => {
        cnt.endpointData = ds.data;
      });
    }

    $Datasource.listDatasources()
    .then(res => {
      if (res.data && res.data.length) {
        cnt.dsList = res.data;

        $Datasource.listEndpoints().then(result => {
          if (result.data && result.data.data) {
            result.data.data.forEach(elem => {
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
          .then(response => {
            $state.go('admin.endpoints', {});
          })
        } else {
          $Datasource.updateObject(cnt.endpointData, "DSEndpoint")
          .then(response => {
            $state.go('admin.endpoints', {});
          })
        }
      }
    };

  }

})();
