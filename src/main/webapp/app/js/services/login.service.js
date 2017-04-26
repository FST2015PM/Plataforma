(function() {
  'use strict';

  angular
    .module('FST2015PM.services')
    .service('$LoginService', LoginService);

  LoginService.$inject = ['$http', '$q'];
  function LoginService($http, $q) {
    let apiVersion = 1; //TODO: Move to app config

    //Service definition
    let service = {};
    service.me = me;
    //TODO: Add login and logout method

    return service;

    //Service iplementation


    function me() {
      var deferred = $q.defer();

      $http({
        url: '/api/v'+apiVersion+'/services/login/me',
        method: "GET"
      }).then(function(response) {
        deferred.resolve(response);
      }).catch(function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    };
  };

})();
