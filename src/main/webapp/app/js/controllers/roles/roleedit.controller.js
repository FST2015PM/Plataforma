(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('RolesEditCtrl', RolesEditCtrl);

  RolesEditCtrl.$inject = ["$Datasource", "$stateParams", "$state"];
  function RolesEditCtrl($Datasource, $stateParams, $state) {
    let cnt = this;
    cnt.roleData = {};
    cnt.formTitle = "Agregar rol";

    //$scope.roleData = {};
    if($stateParams.id && $stateParams.id.length) {
      cnt.formTitle = "Editar rol";
      $Datasource.getObject($stateParams.id, "Role").then(role => {
        cnt.roleData = role.data;
      });
    }

    cnt.submitForm = function(form) {
      if (form.$valid && !cnt.roleData._id) {
        $Datasource.addObject(cnt.roleData, "Role")
        .then(response => {
          $state.go('admin.roles', {});
        })
      } else if(form.$valid && cnt.roleData._id) {
        //$scope.roleData._id = $scope.idEdit;
        $Datasource.updateObject(cnt.roleData, "Role")
        .then((response) => {
          $state.go('admin.roles', {});
        })
      }
    };
  };

})();
