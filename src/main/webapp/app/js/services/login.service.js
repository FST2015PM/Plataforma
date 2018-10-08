(function() {
    'use strict';

    angular
        .module('FST2015PM.services')
        .service('$LoginService', LoginService);

    LoginService.$inject = ['$http', '$q', 'API_VERSION'];
    function LoginService($http, $q, API_VERSION) {
        //Service definition
        var service = {};
        service.me = me;
        //TODO: Add login and logout method

        return service;

        //Service iplementation
        function me() {
            var deferred = $q.defer();

            $http({
                url: '/api/v'+API_VERSION+'/services/login/me',
                method: "GET"
            }).then(function(response) {
                deferred.resolve(response);
            }).catch(function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }
    }

})();
