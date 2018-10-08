(function() {
    'use strict';

    angular
        .module('FST2015PM.services')
        .service('$GeoLayer', GeoLayer);

    GeoLayer.$inject = ['$http', '$q', 'API_VERSION'];
    function GeoLayer($http, $q, API_VERSION) {
        var theUrl = '/api/v'+API_VERSION+'/services/geoLayers';
        //Service definition
        var service = {};
        service.listGeoLayers = listGeoLayers;
        service.addGeoLayer = addGeoLayer;
        service.updateGeoLayer = updateGeoLayer;
        service.getGeoLayer = getGeoLayer;
        service.removeGeoLayer = removeGeoLayer;

        return service;

        //Service iplementation

        /**
         List all geolayers
         */
        function listGeoLayers(queryParams) {
            var deferred = $q.defer();
            var url = theUrl;
            //Add queryParams to url
            if (queryParams && queryParams.length) {
                queryParams.forEach(function(param, i) {
                    url = (i == 0 ? theUrl + "?" : theUrl + "&");
                    url += param.name+'='+param.value;
                });
            }

            $http({
                url: url,
                method: "GET"
            }).then(function(response) {
                deferred.resolve(response);
            }).catch(function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        /**
         Adds a geoLayer
         */
        function addGeoLayer(payload) {
            var deferred = $q.defer();
            if (payload) {
                $http({
                    url: theUrl,
                    method: "POST",
                    data: payload
                }).then(function(response) {
                    deferred.resolve(response);
                }).catch(function(error) {
                    deferred.reject(error);
                });
            } else {
                deferred.reject("No data provided");
            }

            return deferred.promise;
        }

        /**
         Updates a geoLayer
         */
        function updateGeoLayer(payload) {
            var deferred = $q.defer();
            if (payload) {
                var url = theUrl + '/'+payload._id;

                $http({
                    url: url,
                    method: "PUT",
                    data: payload
                }).then(function(response) {
                    deferred.resolve(response);
                })
                    .catch(function(error) {
                        deferred.reject(error);
                    });
            } else {
                deferred.reject("No data provided");
            }

            return deferred.promise;
        }

        /**
         Gets a geoLayer by Id
         */
        function getGeoLayer(objId) {
            var deferred = $q.defer();

            if (objId && objId.length) {
                var url = theUrl + '/'+objId;

                $http({
                    url: url,
                    method: "GET"
                }).then(function(response) {
                    deferred.resolve(response);
                })
                    .catch(function(error) {
                        deferred.reject(error);
                    });
            } else {
                deferred.reject("No object ID provided");
            }
            return deferred.promise;
        }

        /**
         Removes a geoLayer
         */
        function removeGeoLayer(objId) {
            var deferred = $q.defer();

            if (objId && objId.length) {
                var url = theUrl + '/'+objId;

                $http({
                    url: url,
                    method: "DELETE"
                }).then(function(response) {
                    deferred.resolve(response);
                })
                    .catch(function(error) {
                        deferred.reject(error);
                    });
            } else {
                deferred.reject("No object ID provided");
            }

            return deferred.promise;
        }

    }

})();
