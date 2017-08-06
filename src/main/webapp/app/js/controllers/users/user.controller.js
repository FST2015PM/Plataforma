(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('UsersCtrl', UsersCtrl);

  UsersCtrl.$inject = ["$scope", "$Datasource", "$timeout", "$stateParams", "$state", "$q", "toaster"];
  function UsersCtrl($scope, $Datasource, $timeout, $stateParams, $state, $q, toaster) {
    let cnt = this;
    cnt.users = [];

    $Datasource.listObjects("User")
    .then(res => {
      if (res.data && res.data.data) {
        cnt.users = res.data.data;
      }
    });

    cnt.deleteUsr = function (_id) {
      bootbox.confirm("<h4>Este usuario será eliminado permanentemente. \n ¿Desea continuar?</h4>", result => {
        if (result) {
          $Datasource.removeObject(_id, "User")
          .then(response => {
            cnt.users.filter((elem, i) => {
              if (elem._id === _id) {
                cnt.users.splice(i, 1);
              }
            });
            toaster.pop({
              type: 'success',
              body: 'Se ha eliminado el usuario',
              showCloseButton: true,
            });
          })
        }
      });
    };

  };

})();
