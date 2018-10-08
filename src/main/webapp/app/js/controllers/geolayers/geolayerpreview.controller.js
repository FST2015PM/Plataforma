(function() {
    'use strict'

    angular
        .module("FST2015PM.controllers")
        .controller("GeolayerPreviewCtrl", GeolayerPreviewCtrl);

    GeolayerPreviewCtrl.$inject = ["$GeoLayer", "$stateParams", "$http", "$timeout", "$scope"];
    function GeolayerPreviewCtrl($GeoLayer, $stateParams, $http, $timeout, $scope) {
        var cnt = this;
        var df = [40.46, -100.715];
        cnt.layerData = {};

        $timeout(function() {
            cnt.map = dataviz.mapsFactory.createMap("previewMap", ENGINE_LEAFLET, df, 3);
            cnt.map.whenReady(function() {
                loadData();
            });
        });

        function loadData() {
            if ($stateParams.id && $stateParams.id.length) {
                $timeout(function() {
                    $GeoLayer.getGeoLayer($stateParams.id).then(function(layer) {
                        cnt.layerData = layer.data;
                        cnt.map.spin(true);
                        $http({
                            url: cnt.layerData.resourceURL,
                            method: "GET"
                        }).then(function(response) {
                            if (response.status === 200) {
                                if (cnt.layerData.type === "kml") {
                                    dataviz.mapsFactory.addKMLLayer(cnt.map, response.data, ENGINE_LEAFLET, true);
                                } else {
                                    dataviz.mapsFactory.addGeoJSONLayer(cnt.map, response.data, ENGINE_LEAFLET, true);
                                }
                            }
                            cnt.map.spin(false);
                        }).catch(function(error) {
                            cnt.map.spin(false);
                            console.log(error);
                        });
                    });
                }, 500);
            }
        }

        $scope.$on('$destroy', function() {
            if (angular.isDefined(cnt.map)) {
                cnt.map.remove();
            }
        });

    }

})();
