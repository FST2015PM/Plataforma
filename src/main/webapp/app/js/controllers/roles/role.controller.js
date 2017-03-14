(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('RolesCtrl', RolesCtrl);

  RolesCtrl.$inject = ["$Datasource", "$scope"];
  function RolesCtrl($Datasource, $scope) {
    let cnt = this;
    cnt.roles = [];

    $Datasource.listObjects("Role")
    .then((res) => {
      if (res.data && res.data.data) {
        cnt.roles = res.data.data;
      }
    });

    cnt.deleteRole = function (_id) {
      bootbox.confirm("<h3>Este rol será eliminado permanentemente. \n ¿Deseas continuar?</h3>", result => {
        if (result) {
          $Datasource.removeObject(_id, "Role")
          .then((response) => {
            cnt.roles.filter((elem, i) => {
              if (elem._id === _id) {
                cnt.roles.splice(i, 1);
              }
            });
          })
          //$Datasource.getListObjByProp(_id, "role" ,"UserRole")
          $Datasource.listObjects("UserRole", [{name:"role", value:_id}])
          .then((response) => {
            if(response.data && response.data.length) {
              response.data.forEach(userRol => {
                $Datasource.removeObject(userRol._id, "UserRole");
              })
            }
          })
        }
      });
    };
  };

})();
