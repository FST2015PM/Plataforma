(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('PermissionCtrl', PermissionCtrl);

  PermissionCtrl.$inject = ["$Datasource", "$scope"];
  function PermissionCtrl($Datasource, $scope) {
    let cnt = this;
    cnt.pages = [];
    cnt.menus = [];

    $Datasource.listObjects("Permission")
    .then((res) => {
      if (res.data && res.data.data) {
        cnt.pages = res.data.data;
      }
    });
    
    cnt.deletePermissionPage = function (_id) {
      bootbox.confirm("<h3>Este permiso será eliminado permanentemente. \n ¿Deseas continuar?</h3>", result => {
        if (result) {
          $Datasource.removeObject(_id, "Permission")
          .then((response) => {
            cnt.pages.filter((elem, i) => {
              if (elem._id === _id) {
                cnt.pages.splice(i, 1);
              }
            });
          })
          //$Datasource.getListObjByProp(_id, "role" ,"UserRole")
          $Datasource.listObjects("PageRole", [{name:"role", value:_id}])
          .then((response) => {
            if(response.data && response.data.length) {
              response.data.forEach(pageRol => {
                $Datasource.removeObject(pageRol._id, "PageRole");
              })
            }
          })
        }
      });
    };
    
    cnt.deleteMenu = function (_id) {
      bootbox.confirm("<h3>Este menuTab será eliminado permanentemente. \n ¿Deseas continuar?</h3>", result => {
        if (result) {
          $Datasource.removeObject(_id, "MenuTab")
          .then((response) => {
            cnt.pages.filter((elem, i) => {
              if (elem._id === _id) {
                cnt.pages.splice(i, 1);
              }
            });
          })
          //$Datasource.getListObjByProp(_id, "role" ,"UserRole")
          /*$Datasource.listObjects("PageRole", [{name:"role", value:_id}])
          .then((response) => {
            if(response.data && response.data.length) {
              response.data.forEach(pageRol => {
                $Datasource.removeObject(pageRol._id, "PageRole");
              })
            }
          })*/
        }
      });
    };    
    
  //};

  };

})();
