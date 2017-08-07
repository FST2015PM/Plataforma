(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('RolesCtrl', RolesCtrl);

  RolesCtrl.$inject = ["$Datasource", "toaster"];
  function RolesCtrl($Datasource, toaster) {
    let cnt = this;
    cnt.roles = [];

    $Datasource.listObjects("Role")
    .then(function(res) {
      if (res.data && res.data.data) {
        cnt.roles = res.data.data;
      }
    });

    cnt.deleteRole = function (_id) {
      bootbox.confirm({
        message: "<h4>Este rol será eliminado permanentemente. \n ¿Desea continuar?</h4>",
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
            $Datasource.removeObject(_id, "Role")
            .then(function(response) {
              cnt.roles.filter(function(elem, i) {
                if (elem._id === _id) {
                  cnt.roles.splice(i, 1);
                }
              });
            });
            //$Datasource.getListObjByProp(_id, "role" ,"UserRole")
            //TODO: Change ACL service to define fine-grained permissions and separate role info from users

            /*$Datasource.listObjects("UserRole", [{name:"role", value:_id}])
            .then(function(response) {
              if(response.data && response.data.length) {
                response.data.forEach(function(userRol) {
                  $Datasource.removeObject(userRol._id, "UserRole");
                })
              }
            });*/

            toaster.pop({
              type: 'success',
              body: 'Se ha eliminado el rol',
              showCloseButton: true,
            });
          }
        }
      });
    };

  };

})();
