(function() {
    'use strict';

    angular
        .module('FST2015PM.services')
        .service('$Extractor', ExtractorService);

    ExtractorService.$inject = ['$http', '$q', 'API_VERSION'];
    function ExtractorService($http, $q, API_VERSION) {
        var service = {},
            gatewayPath = '/api/v'+API_VERSION+'/services/extractor/';

        service.loadExtractor = loadExtractor;
        service.startExtractor = startExtractor;
        service.stopExtractor = stopExtractor;
        service.getStatus = getStatus;
        service.getEncodingList = getEncodingList;
        service.downloadPreview = downloadPreview;

        return service;

        function getEncodingList() {
            var deferred = $q.defer();

            var theUrl = '/api/v'+API_VERSION+'/services/encoding';
            var request = $http({
                url: theUrl,
                method: "GET"
            }).then(function(response) {
                deferred.resolve(response.data);
            })
            .catch(function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function loadExtractor(id) {
            var deferred = $q.defer();

            if (id === undefined) return;
            var theUrl = gatewayPath + "load/" + id;
            var request = $http({
                url: theUrl,
                method: "POST"
            }).then(function(response) {
                deferred.resolve(response);
            })
            .catch(function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function startExtractor(id) {
            var deferred = $q.defer();

            if (id === undefined) return;
            var theUrl = gatewayPath + "start/" + id;
            var request = $http({
                url: theUrl,
                method: "POST"
            }).then(function(response) {
                deferred.resolve(response);
            })
            .catch(function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function stopExtractor(id) {
            if (id === undefined) return;
            var theUrl = gatewayPath + "stop/" + id;
            var request = $http({
                url: theUrl,
                method: "POST"
            });
            return request;
        }

        function getStatus(id) {
            var deferred = $q.defer();

            if (id === undefined) return;
            var theUrl = gatewayPath + "status/" + id;
            var request = $http({
                url: theUrl,
                method: "GET"
            }).then(function(response) {
                if (response.status === 200) {
                    deferred.resolve(response.data.status);
                } else {
                    deferred.reject();
                }
            }).catch(function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function downloadPreview(fileLocation, zipped, charset, relPath) {
            //TODO: Initialize zipped to false and charset to utf-8
            var deferred = $q.defer();

            if (fileLocation === undefined) return;
            var _url = '/api/v'+API_VERSION+'/services/csvpreview';
            var request = $http({
                url: _url,
                data: {fileLocation: fileLocation, zipped: zipped, charset: charset, zipPath: relPath},
                method: "POST"
            }).then(function(response) {
                deferred.resolve(response);
            })
            .catch(function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }
    }

})();
