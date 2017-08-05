(function() {
  'use strict';

  angular
    .module('FST2015PM.services')
    .service('$ACLService', ACLService);

  ACLService.$inject = ['$http', '$q'];
  function ACLService($http, $q) {
    let apiVersion = 1; //TODO: Move to app config
    //Service definition
    let service = {};
    service.getUserActions = getUserActions;

    return service;

    //Service iplementation

    function getUserActions(userInfo) {
      var deferred = $q.defer();
      var uInfo = userInfo || undefined;

      if (!userInfo) {
        $http({
          url: '/api/v'+apiVersion+'/services/login/me',
          method: "GET"
        }).then(function(response) {
          var retData = [];
          if (response.data) {
            retData = getMenuItems(response.data)
          }
          deferred.resolve({data: retData});
        }).catch(function(error) {
          deferred.reject(error);
        });
      } else {
        deferred.resolve({data: getMenuItems(userInfo)});
      }

      return deferred.promise;
    };

  };

  function getMenuItems(userInfo) {
    var retData = [];
    if (userInfo) {
      adminMenuItems.forEach(function(item) {
        var add = false;
        if (item.roles && item.roles.length) {
          if (item.roles.indexOf("Admin") > -1 && userInfo.isAdmin) {
            retData.push(item);
          }
        } else {
          retData.push(item);
        }
      });
    }

    return retData;
  };

  var adminMenuItems = [
    {
      label: "Administración",
      menuItems: [
        {
          label: "Usuarios y permisos",
          roles: ["Admin"],
          menuItems: [
            {
              label:"Usuarios",
              cssClass: "fa fa-user fa-fw",
              stateLink: 'admin.users'
            },
            {
              label:"Roles",
              cssClass: "fa fa-user-times fa-fw",
              stateLink: 'admin.roles'
            }
          ]
        },
        {
          label: "Fuentes de datos",
          menuItems: [
            {
              label:"Extractores",
              cssClass: "fa fa-cogs fa-fw",
              stateLink: 'admin.extractors'
            },
            {
              label:"Conjuntos de datos",
              cssClass: "fa fa-table fa-fw",
              stateLink: 'admin.datasources'
            },
            {
              label:"Capas",
              cssClass: "fa fa-map-o fa-fw",
              stateLink: 'admin.geolayers'
            }
          ]
        },
        {
          label: "Puntos de acceso",
          roles: ["Admin"],
          menuItems: [
            {
              label:"Puntos de acceso",
              stateLink: "admin.endpoints",
              cssClass: "fa fa-plug fa-fw"
            },
            {
              label:"Llaves API",
              stateLink:"admin.apikeys",
              cssClass: "fa fa-key fa-fw"
            }
          ]
        }
      ]
    },
    {
      label: "Gestión de destinos",
      menuItems: [
        {
          label: "",
          menuItems: [
            {
              label: "Pueblos Mágicos",
              stateLink: 'admin.pmcatalog',
              cssClass: "fa icon-magictown fa-fw"
            },
            {
              label: "Tableros",
              stateLink: 'admin.dashboards',
              cssClass: "fa fa-dashboard fa-fw"
            }
          ]
        }
      ]
    },
    {
      label: "",
      menuItems: [
        {
          label: "",
          menuItems: [
            {
              label: "Bitácora",
              stateLink: 'admin.activity',
              cssClass: "fa fa-clock-o fa-fw"
            }
          ]
        }
      ]
    }
  ];

  /*var adminMenuItems = [
    {
      label: "Usuarios y permisos",
      roles: ["Admin"],
      menuItems: [
        {
          label:"Usuarios",
          cssClass: "fa fa-user fa-fw",
          stateLink: 'admin.users'
        },
        {
          label:"Roles",
          cssClass: "fa fa-user-times fa-fw",
          stateLink: 'admin.roles'
        }
      ]
    },
    {
      label: "Fuentes de datos",
      menuItems: [
        {
          label:"Conjuntos",
          cssClass: "fa fa-table fa-fw",
          stateLink: 'admin.datasources'
        },
        {
          label:"Capas",
          cssClass: "fa fa-map-o fa-fw",
          stateLink: 'admin.geolayers'
        },
        {
          label:"Extractores",
          cssClass: "fa fa-cogs fa-fw",
          stateLink: 'admin.extractors'
        }
      ]
    },
    {
      label: "Pueblos Mágicos",
      stateLink: 'admin.pmcatalog'
    },
    {
      label: "Tableros",
      stateLink: 'admin.dashboards'
    },
    {
      label: "Puntos de acceso",
      roles: ["Admin"],
      menuItems: [
        {
          label:"End Points",
          stateLink: "admin.endpoints"
        },
        {
          label:"Llaves API",
          stateLink:"admin.apikeys"
        }
      ]
    },
    {
      label: "Bitácora",
      stateLink: 'admin.activity'
    },
  ];*/

})();
