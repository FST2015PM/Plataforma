(function() {
  'use strict';

  angular
    .module('FST2015PM.services')
    .service('$Extractor', ExtractorService);

  ExtractorService.$inject = ['$http', '$q'];
  function ExtractorService($http, $q) {
    let service = {},
        apiVersion = 1,
        gatewayPath = `/api/v${apiVersion}/services/extractor/`;

    service.loadExtractor = loadExtractor;
    service.startExtractor = startExtractor;
    service.stopExtractor = stopExtractor;
    service.getStatus = getStatus;
    service.getEncodingList = getEncodingList;
    service.downloadPreview = downloadPreview;

    return service;

    function getEncodingList() {
      let deferred = $q.defer();

      let theUrl = `/api/v${apiVersion}/services/encoding`;
      let request = $http({
        url: theUrl,
        method: "GET"
      }).then(response => {
        deferred.resolve(response.data);
      })
      .catch(error => {
        deferred.reject(error);
      });

      return deferred.promise;
    };

    function loadExtractor(id) {
      let deferred = $q.defer();

      if (id === undefined) return;
      let theUrl = gatewayPath + "load/" + id;
      let request = $http({
        url: theUrl,
        method: "POST"
      }).then(response => {
        deferred.resolve(response);
      })
      .catch(error => {
        deferred.reject(error);
      });

      return deferred.promise;
    };

    function startExtractor(id) {
      let deferred = $q.defer();

      if (id === undefined) return;
      let theUrl = gatewayPath + "start/" + id;
      let request = $http({
        url: theUrl,
        method: "POST"
      }).then(response => {
        deferred.resolve(response);
      })
      .catch(error => {
        deferred.reject(error);
      });

      return deferred.promise;
    };

    function stopExtractor(id) {
      if (id === undefined) return;
      let theUrl = gatewayPath + "stop/" + id;
      let request = $http({
        url: theUrl,
        method: "POST"
      });
      return request;
    };

    function getStatus(id) {
      let deferred = $q.defer();

      if (id === undefined) return;
      let theUrl = gatewayPath + "status/" + id;
      let request = $http({
        url: theUrl,
        method: "GET"
      }).then((response) => {
        if (response.status === 200) {
            deferred.resolve(response.data.status);
        } else {
          deferred.reject();
        }
      }).catch((error) => {
        deferred.reject(error);
      });

      return deferred.promise;
    };

    function downloadPreview(fileLocation, zipped=false, charset="UTF-8", relPath) {
      let deferred = $q.defer();

      if (fileLocation === undefined) return;
      let _url = `/api/v${apiVersion}/services/csvpreview`
      let request = $http({
        url: _url,
        data: {fileLocation: fileLocation, zipped: zipped, charset: charset, zipPath: relPath},
        method: "POST"
      }).then((response) => {
        deferred.resolve(response);
      })
      .catch((error) => {
        deferred.reject(error);
      });

      return deferred.promise;
    };
  };

})();
