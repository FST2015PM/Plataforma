(function() {
    'use strict'

    angular
        .module("FST2015PM.controllers")
        .controller("OntologyCtrl", OntologyCtrl);

    OntologyCtrl.$inject = ["$GeoLayer", "$Datasource", "$scope","ontology", "$timeout"];
    function OntologyCtrl($GeoLayer, $Datasource, $scope, ontology, $timeout) {
        var cnt = this;

        cnt.dimension = "";
        cnt.dimensions = ontology.categories.map(function(item) { return item.name; });
        cnt.selected;

        //Set counters
        ontology.nodes.forEach(function(node) {
            node.datasourceCount = 0;
            node.layerCount = 0;
        });

        //Get datasource count
        $Datasource.listDatasources()
            .then(function(res) {
                if (res.data && res.data.length) {
                    res.data.forEach(function(ds) {
                        var o = ontology.nodes.filter(function(item) {
                            return item.category === ds.ontCategory && item.name === ds.ontConcept;
                        });

                        if (o.length > 0) {
                            o[0].datasourceCount = o[0].datasourceCount + 1;
                        }
                    });

                    //Update styles
                    ontology.nodes.forEach(function(node) {
                        if (node.datasourceCount > 0) {
                            node.styleid = node.styleid + " hasContent";
                        }
                    });
                }
            });

        //Get layer count
        $GeoLayer.listGeoLayers()
            .then(function(res) {
                if (res.data && res.data.length) {
                    res.data.forEach(function(ds) {
                        var o = ontology.nodes.filter(function(item) {
                            return item.category === ds.ontCategory && item.name === ds.ontConcept;
                        });

                        if (o.length > 0) {
                            o[0].layerCount = o[0].layerCount + 1;
                        }
                    });

                    //Update styles
                    ontology.nodes.forEach(function(node) {
                        if (node.layerCount > 0) {
                            node.styleid = node.styleid + " hasContent";
                        }
                    });
                }
            });

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

            if (cnt.dimension) {
                newSet.nodes = filterNodes(ontology.nodes, cnt.dimension);

                var nodesHash = newSet.nodes.map(function(item) {
                    return item.id;
                });

                newSet.edges = ontology.edges.filter(function(item) {
                    return nodesHash.indexOf(item.source) > -1 && nodesHash.indexOf(item.target) > -1;
                });
            } else {
                newSet = ontology;
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
            return item.category === category;
        });
    }

})();
