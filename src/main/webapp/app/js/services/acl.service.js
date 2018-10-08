(function() {
    'use strict';

    angular
        .module('FST2015PM.services')
        .service('$ACLService', ACLService);

    ACLService.$inject = ['$http', '$q', 'API_VERSION'];
    function ACLService($http, $q, API_VERSION) {
        //Service definition
        var service = {};
        service.getUserActions = getUserActions;

        return service;

        //Service iplementation
        function getUserActions(userInfo) {
            var deferred = $q.defer();
            var uInfo = userInfo || undefined;
            var roles = [];

            if (!userInfo) {
                $http({
                    url: '/api/v'+API_VERSION+'/services/login/me',
                    method: "GET"
                }).then(function(response) {
                    var retData = [];
                    if (response.data) {
                        retData = getMenuItems(response.data);
                    }
                    deferred.resolve({data: retData});
                }).catch(function(error) {
                    deferred.reject(error);
                });
            } else {
                deferred.resolve({data: getMenuItems(userInfo)});
            }

            return deferred.promise;
        }

    }

    //Utility methods
    function checkItemsAccess(items, userInfo) {
        //Filter first level items
        var ret = items.filter(function(element) {
            return !element.roles || element.roles.indexOf("Admin") > -1 && userInfo.isAdmin;
        });

        //Filter items recursively
        for (var i = 0; i < ret.length; i++) {
            if (ret[i].menuItems && ret[i].menuItems.length) {
                ret[i].menuItems = checkItemsAccess(ret[i].menuItems, userInfo);
            }
        }

        return ret;
    }

    function getMenuItems(userInfo) {
        var retData = [];
        if (userInfo) {
            retData = checkItemsAccess(adminMenuItems, userInfo);
        }

        return retData;
    }

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
                        }/*,
            {
              label:"Roles",
              cssClass: "fa fa-user-times fa-fw",
              stateLink: 'admin.roles'
            }*/
                    ]
                },
                {
                    label: "Fuentes de datos",
                    menuItems: [
                        {
                            label:"Extractores",
                            cssClass: "fas fa-cogs fa-fw",
                            stateLink: 'admin.extractors'
                        },
                        {
                            label:"Conjuntos de datos",
                            cssClass: "fas fa-database fa-fw",
                            stateLink: 'admin.datasources'
                        },
                        {
                            label:"Capas",
                            cssClass: "fas fa-map-marked-alt fa-fw",
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
                            cssClass: "fas fa-plug fa-fw"
                        },
                        {
                            label:"Llaves API",
                            stateLink:"admin.apikeys",
                            cssClass: "fas fa-key fa-fw"
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
                            roles: ["Admin"],
                            stateLink: 'admin.pmcatalog',
                            cssClass: "fas icon-magictown fa-fw"
                        },
                        {
                            label: "Tableros",
                            stateLink: 'admin.dashboards',
                            cssClass: "fas fa-th fa-fw"
                        }
                    ]
                }
            ]
        },
        {
            label: "",
            roles: ["Admin"],
            menuItems: [
                {
                    label: "",
                    menuItems: [
                        {
                            label: "Ontología",
                            stateLink: 'admin.pmontology',
                            cssClass: "fas fa-share-alt fa-fw"
                        }
                    ]
                },
                {
                    label: "",
                    menuItems: [
                        {
                            label: "Bitácora",
                            stateLink: 'admin.activity',
                            cssClass: "fas fa-clock fa-fw"
                        }
                    ]
                }
            ]
        }
    ];

})();
