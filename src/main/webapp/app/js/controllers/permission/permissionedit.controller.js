(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('PermissionEditCtrl', PermissionEditCtrl);

  PermissionEditCtrl.$inject = ["$Datasource", "$stateParams", "$state"];
  function PermissionEditCtrl($Datasource, $stateParams, $state) {
      let cnt = this;
    cnt.pageData = {};
    cnt.pagesRoles = [];
    cnt.selectedRoles = [];
    cnt.pmList = [];
    cnt.formTitle = "Agregar permiso";

    $Datasource.listObjects("Role")
    .then((res) => {
      if (res.data && res.data.data) {
        cnt.pagesRoles = res.data.data;
      }
    });

    if ($stateParams.id && $stateParams.id.length) {
      cnt.formTitle = "Editar permiso";
      $Datasource.getObject($stateParams.id, "Permission").then(permission => {
        cnt.pageData = permission.data;
        cnt.selectedRoles = cnt.pageData.roles || [];
      });
    }

    cnt.submitForm = function(form) {
      if (form.$valid) {
        cnt.pageData.roles = cnt.selectedRoles;
        
        if ($stateParams.id && $stateParams.id.length) {
          $Datasource.updateObject(cnt.pageData, "Permission")
          .then(response => {
            $state.go('admin.permission', {});
          });
        } else {
         
          $Datasource.addObject(cnt.pageData, "Permission")
          .then(response => {
            $state.go('admin.permission', {});
          });
        }
      }
    }
  };
      
      
      
      
      
      
      
      
      
})();
