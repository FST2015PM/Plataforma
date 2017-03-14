(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('UsersEditCtrl', UsersEditCtrl);

  UsersEditCtrl.$inject = ["$Datasource", "$stateParams", "$state"];
  function UsersEditCtrl($Datasource, $stateParams, $state) {
    let cnt = this;
    cnt.userData = {};
    cnt.userRoles = [];
    cnt.selectedRoles = [];
    cnt.pmList = [];
    cnt.password1 = "";
    cnt.password2 = "";
    cnt.formTitle = "Agregar usuario";

    $Datasource.listObjects("MagicTown")
    .then((res) => {
      if (res.data && res.data.data) {
        cnt.pmList = res.data.data;
      }
    });

    $Datasource.listObjects("Role")
    .then((res) => {
      if (res.data && res.data.data) {
        cnt.userRoles = res.data.data;
      }
    });

    if ($stateParams.id && $stateParams.id.length) {
      cnt.formTitle = "Editar usuario";
      $Datasource.getObject($stateParams.id, "User").then(user => {
        cnt.userData = user.data;
        cnt.selectedRoles = cnt.userData.roles || [];
      });
    }

    cnt.isPasswordEqual = function () {
      return cnt.password1 === cnt.password2;
    }

    cnt.submitForm = function(form) {
      if (form.$valid && cnt.isPasswordEqual()) {
        cnt.userData.roles = cnt.selectedRoles;
        if (!cnt.userData.magictown) cnt.userData.magictown = "";
        if ($stateParams.id && $stateParams.id.length) {
          $Datasource.updateObject(cnt.userData, "User")
          .then(response => {
            $state.go('admin.users', {});
          });
        } else {
          cnt.userData.password = cnt.password1;
          $Datasource.addObject(cnt.userData, "User")
          .then(response => {
            $state.go('admin.users', {});
          });
        }
      }
    };
  };

})();
