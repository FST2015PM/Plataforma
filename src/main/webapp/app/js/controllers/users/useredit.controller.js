(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('UsersEditCtrl', UsersEditCtrl);

  UsersEditCtrl.$inject = ["$rootScope", "$Datasource", "$stateParams", "$state", "$http", "$window", "toaster"];
  function UsersEditCtrl($rootScope, $Datasource, $stateParams, $state, $http, $window, toaster) {
    var cnt = this;
    var apiVersion = 1;
    cnt.userData = {};
    cnt.userRoles = [];
    cnt.selectedRoles = [];
    cnt.pmList = [];
    cnt.password1 = "";
    cnt.password2 = "";
    cnt.formTitle = "Agregar usuario";
    cnt.processing = false;

    $Datasource.listObjects("MagicTown")
    .then(function (res) {
      if (res.data && res.data.data) {
        cnt.pmList = res.data.data;
      }
    });

    $Datasource.listObjects("Role")
    .then(function (res) {
      if (res.data && res.data.data) {
        cnt.userRoles = res.data.data;
      }
    });

    if ($stateParams.id && $stateParams.id.length) {
      cnt.formTitle = "Editar usuario";
      $Datasource.getObject($stateParams.id, "User")
        .then(function(user) {
          cnt.userData = user.data;
          cnt.selectedRoles = cnt.userData.roles || [];
        });
    }

    cnt.isPasswordEqual = function () {
      return cnt.password1 === cnt.password2;
    }

    cnt.submitForm = function(form) {
      var valid = form.$valid && cnt.isPasswordEqual();

      if (valid) {
        cnt.processing = true;

        cnt.userData.password = cnt.password1;
        cnt.userData.roles = cnt.selectedRoles;
        if (!cnt.userData.magictown) cnt.userData.magictown = "";
        if ($stateParams.id && $stateParams.id.length) {
          $Datasource.updateObject(cnt.userData, "User")
          .then(function(response) {
            $http({
              url: `/api/v${apiVersion}/services/login/me`,
              method: "GET"
            }).then(function(response) {
              $rootScope.userInfo = response.data;
            }).catch(function(error) {
              $window.location.href = "/login"
            });
            toaster.pop({
              type: 'success',
              body: 'Se ha actualizado el usuario',
              showCloseButton: true,
            });
            $state.go('admin.users', {});
          });
        } else {
          $Datasource.addObject(cnt.userData, "User")
          .then(function(response) {
            $http({
              url: `/api/v${apiVersion}/services/login/me`,
              method: "GET"
            }).then(function(response) {
              $rootScope.userInfo = response.data;
            }).catch(function(error) {
              $window.location.href = "/login"
            });
            toaster.pop({
              type: 'success',
              body: 'Se ha agregado el nuevo usuario',
              showCloseButton: true,
            });
            $state.go('admin.users', {});
          });
        }
      }
    };
  };

})();
