(function () {
    'use strict';

    angular
        .module('FST2015PM.services')
        .service('$PMCatalogService', PMCatalogService);

    PMCatalogService.$inject = ['$http', '$q'];//,'$stateParams', '$scope'

    function PMCatalogService($http, $q) {//$stateParams, $scope
        this.list = function (url) {
            var deferred = $q.defer();
            $http.get(url).then(
                function (response) { // Success callback
                    deferred.resolve(response.data.data); // Resolve
                },
                function (response) { // Error callback
                    deferred.reject(response); // Reject
                }
            );
            return deferred.promise;
        };

        this.savePM = function (url, params) {
            var deferred = $q.defer();
            $http.post(url, params).then(
                function (response) { // Success callback
                    deferred.resolve(response.data.data); // Resolve
                },
                function (response) { // Error callback
                    deferred.reject(response); // Reject
                }
            );
            return deferred.promise;
        };

        this.getById = function (url) {
            var deferred = $q.defer();
            $http.get(url).then(
                function (response) { // Success callback
                    deferred.resolve(response.data); // Resolve
                },
                function (response) { // Error callback
                    deferred.reject(response); // Reject
                }
            );
            return deferred.promise;
        };

        this.delete = function (url) {
            var deferred = $q.defer();
            $http.delete(url).then(
                function (response) { // Success callback
                    deferred.resolve(response.data.data); // Resolve
                },
                function (response) { // Error callback
                    deferred.reject(response); // Reject
                }
            );
            return deferred.promise;
        }
    }

})();



 