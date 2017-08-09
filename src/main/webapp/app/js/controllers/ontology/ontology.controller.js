(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("OntologyCtrl", OntologyCtrl);

  OntologyCtrl.$inject = ["$scope","ontology", "$timeout"];
  function OntologyCtrl($scope, ontology, $timeout) {
    let cnt = this;

    cnt.dimension = "Todas";
    cnt.dimensions = ["Todas", "Superestructura", "Infraestructura", "Cultura",
    "Comunidad Local", "Espacio geográfico", "Oferta", "Demanda", "Medio Natural",
    "Desarrollo Sustentable", "Mercadotecnia", "Servicios"];
    cnt.selected;

    //Draw graph
    $timeout(function () {
      dataviz.graphsFactory.createGraph("graph", ontology);
    }, 500);

    //Scope function for library
    $scope.setSelectedNode = function(data) {
      $timeout(function () {
        cnt.selected = data;
      },0)
    };

    cnt.resetSelected = function() {
      cnt.selected = undefined;
    };

    //Callback for filter
    cnt.updateGraph = function() {
      cnt.selected = undefined;
      var newSet = {};

      if (cnt.dimension === "Todas") {
        newSet = ontology;
      } else {
        newSet.nodes = filterNodes(ontology.nodes, cnt.dimension);

        var nodesHash = newSet.nodes.map(function(item) {
          return item.id;
        });

        newSet.edges = ontology.edges.filter(function(item) {
          return nodesHash.indexOf(item.source) > -1 && nodesHash.indexOf(item.target) > -1;
        });
      }

      $timeout(function () {
        dataviz.graphsFactory.createGraph("graph", newSet);
      }, 0);
    };

    $scope.$on('$destroy', function() {
      dataviz.graphsFactory.destroy();
    });
  }


  function filterNodes(nodes, category) {
    return nodes.filter(function(item) {
      return item.category == category;
    });
  };

})();
