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
      label: "Usuarios y permisos",
      roles: ["Admin"],
      menuItems: [
        {
          label:"Usuarios",
          stateLink: 'admin.users'
        },
        {
          label:"Roles",
          stateLink: 'admin.roles'
        }
      ]
    },
    {
      label: "Fuentes de datos",
      menuItems: [
        {
          label:"Extractores",
          stateLink: 'admin.extractors'
        },
        {
          label:"Conjuntos",
          stateLink: 'admin.datasources'
        },
        {
          label:"Capas",
          stateLink: 'admin.geolayers'
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
  ];

})();
