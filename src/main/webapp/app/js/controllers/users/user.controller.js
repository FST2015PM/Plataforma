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
    .then(function(res) {
      if (res.data && res.data.data) {
        cnt.users = res.data.data;
      }
    });

    cnt.deleteUsr = function (_id) {
      bootbox.confirm({
        message: "<h4>Este usuario será eliminado permanentemente. \n ¿Desea continuar?</h4>",
        buttons: {
          cancel: {
            label: "Cancelar"
          },
          confirm: {
            label: "Aceptar"
          }
        },
        callback: function(res) {
          if (res) {
            $Datasource.removeObject(_id, "User")
            .then(function(response) {
              cnt.users.filter(function(elem, i) {
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
        }
      });
    };

  };

})();
