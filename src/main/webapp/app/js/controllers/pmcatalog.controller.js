(function () {
    'use strict';

    angular
            .module('FST2015PM.controllers')
            .controller('PMCatalog', PMCatalog);

    PMCatalog.$inject = ['$scope', '$PMCatalogService'];
    function PMCatalog($scope, $PMCatalogService) {
        $scope.dbPM = {nombre: "", descripcion: "", imagen: "", claveEstado: "", claveMunicipio: "", claveGeo: "", incorporado: false};
        $scope.listPMCatalog = [];
        $scope.show = "all";

        $scope.listPM = function () {
            $PMCatalogService.list('/servicespm?action=list').then(function (pm) {
                $scope.listPMCatalog = pm;
            });
        }

        $scope.formPM = function () {
            if ($scope.show == 'add') {
                $PMCatalogService.savePM('/servicespm?action=add', $scope.dbPM).then(function () {
                    $scope.show = "all";
                    $scope.listPM();
                });
            } else if ($scope.show == 'update') {
                $PMCatalogService.savePM('/servicespm?action=update', $scope.dbPM).then(function () {
                    $scope.show = "all";
                    $scope.listPM();
                });
            }
        }

        $scope.configAdd = function () {
            $scope.dbPM = {nombre: "", descripcion: "", imagen: "", claveEstado: "", claveMunicipio: "", claveGeo: "", incorporado: false};
            $scope.show = "add";
        }

        $scope.configUpdate = function (_id) {
            $PMCatalogService.getById('/servicespm?action=detail&_id=' + _id).then(function (pm) {
                $scope.dbPM._id = pm._id;
                $scope.dbPM.nombre = pm.nombre;
                $scope.dbPM.descripcion = pm.descripcion;
                $scope.dbPM.imagen = pm.imagen;
                $scope.dbPM.claveEstado = pm.claveEstado;
                $scope.dbPM.claveMunicipio = pm.claveMunicipio;
                $scope.dbPM.claveGeo = pm.claveGeo;
                $scope.dbPM.incorporado = pm.incorporado;

                $scope.show = "update";
            });
        }
        
        $scope.deletePM = function (_id) {
                bootbox.confirm("<h3>Este pueblo mágico será eliminado permanentemente. \n ¿Deseas continuar?</h3>", function (result) {
                    if (result) {
                        $PMCatalogService.delete('/servicespm?action=delete&id=' + _id).then(function () {
                            $scope.listPMCatalog.filter(function (elem, i) {
                                if (elem._id === _id) {
                                    $scope.listPMCatalog.splice(i, 1);
                                }
                            });
                        });
                    }
                });
            };

        $scope.listPM();

    }

})();