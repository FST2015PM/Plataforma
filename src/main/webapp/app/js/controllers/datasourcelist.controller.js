(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('DataSourcesCtrl', DataSourcesCtrl);

    DataSourcesCtrl.$inject = ['$scope', '$FileManager'];
    function DataSourcesCtrl($scope, $FileManager) {
      $scope.dataSources = [];

      $FileManager.getFiles()
        .then(function(res) {
          $scope.dataSources = res.data;
        });
    }

})();
