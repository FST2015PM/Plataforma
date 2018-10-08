(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('ChartsCtrl', ChartsCtrl);

    ChartsCtrl.$inject = ['$scope', '$http'];
    function ChartsCtrl($scope, $http) {
      //Invoke dataviz functions here
      var request = $http({
        url: "/app/mockdata/piedata.json",
        method: "GET"
      }).then(function(res) {
        console.log(d3.scale);
        dataviz.chartsFactory.createChart("myChart", res.data);
      });
    }
})();
