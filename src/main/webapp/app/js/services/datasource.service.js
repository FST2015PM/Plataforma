(function() {
  'use strict';

  angular
    .module('FST2015PM.services')
    .service('$Datasource', DataSource);

  DataSource.$inject = ['$http', '$q'];
  function DataSource($http, $q) {
    let apiVersion = 1; //TODO: Move to app config
    //Service definition
    let service = {};
    service.listDatasources = listDatasources;
    service.listObjects = listObjects;
    service.addObject = addObject;
    service.updateObject = updateObject;
    service.getObject = getObject;
    service.removeObject = removeObject;
    //service.getListObjByProp = getListObjByProp;

    return service;

    //Service iplementation

    /**
    Gets a list of all datasource names
    */
    function listDatasources() {
      let theUrl = `/api/v${apiVersion}/datasources`;
      let request = $http({
        url: theUrl,
        method: "GET"
      });
      return request;
    };

    /**
    List all objects from a given datasource
    */
    function listObjects(dsName, queryParams) {
      var deferred = $q.defer();

      if (dsName && dsName.length) {
        let theUrl = `/api/v${apiVersion}/datasources/${dsName}`;
        //Add queryParams to url
        if (queryParams && queryParams.length) {
          queryParams.forEach((param, i) => {
            theUrl = (i == 0 ? theUrl + "?" : theUrl + "&");
            theUrl += `${param.name}=${param.value}`;
          });
        }

        $http({
          url: theUrl,
          method: "GET"
        }).then((response) => {
          deferred.resolve(response);
        }).catch((error) => {
          deferred.reject(error);
        });
      } else {
        deferred.reject("No datasource name provided");
      }

      return deferred.promise;
    };

    /**
    Adds an object to a given datasource
    */
    function addObject(payload, dsName) {
      var deferred = $q.defer();

      if (dsName && dsName.length) {
        if (payload) {
          let theUrl = `/api/v${apiVersion}/datasources/${dsName}`;
          $http({
            url: theUrl,
            method: "POST",
            data: payload
          }).then((response) => {
            deferred.resolve(response);
          }).catch((error) => {
            deferred.reject(error);
          });
        } else {
          deferred.reject("No data provided");
        }
      } else {
        deferred.reject("No datasource name provided");
      }

      return deferred.promise;
    };

    /**
    Updates an object in a given datasource
    */
    function updateObject(payload, dsName) {
      var deferred = $q.defer();
      if (dsName && dsName.length) {
        if (payload) {
          let theUrl = `/api/v${apiVersion}/datasources/${dsName}/${payload._id}`;

          $http({
            url: theUrl,
            method: "PUT",
            data: payload
          }).then((response) => {
            deferred.resolve(response);
          })
          .catch((error) => {
            deferred.reject(error);
          });
        } else {
          deferred.reject("No data provided");
        }
      } else {
        deferred.reject("No datasource name provided");
      }

      return deferred.promise;
    }

    /**
    Gets an object with given ID from a datasource
    */
    function getObject(objId, dsName) {
      var deferred = $q.defer();
      if (dsName && dsName.length) {
        if (objId && objId.length) {
          let theUrl = `/api/v${apiVersion}/datasources/${dsName}/${objId}`;
          $http({
            url: theUrl,
            method: "GET"
          }).then((response) => {
            deferred.resolve(response);
          })
          .catch((error) => {
            deferred.reject(error);
          });
        } else {
          deferred.reject("No object ID provided");
        }
      } else {
        deferred.reject("No datasource name provided");
      }

      return deferred.promise;
    }

    /**
    Gets an object with given ID from a datasource
    */
    /*function getListObjByProp(objId, prop, dsName) {
      var deferred = $q.defer();
      if (dsName && dsName.length) {
        if (objId && objId.length) {
          let theUrl = `/api/datasources/${dsName}/${prop}/${objId}`;
          $http({
            url: theUrl,
            method: "GET"
          }).then((response) => {
            deferred.resolve(response);
          })
          .catch((error) => {
            deferred.reject(error);
          });
        } else {
          deferred.reject("No object ID provided");
        }
      } else {
        deferred.reject("No datasource name provided");
      }

      return deferred.promise;
    }*/

    /**
    Removes an object from a given datasource
    */
    function removeObject(objId, dsName) {
      var deferred = $q.defer();
      if (dsName && dsName.length) {
        if (objId && objId.length) {
          let theUrl = `/api/v${apiVersion}/datasources/${dsName}/${objId}`;

          $http({
            url: theUrl,
            method: "DELETE"
          }).then((response) => {
            deferred.resolve(response);
          })
          .catch((error) => {
            deferred.reject(error);
          });
        } else {
          deferred.reject("No object ID provided");
        }
      } else {
        deferred.reject("No datasource name provided");
      }

      return deferred.promise;
    }

  };

})();
