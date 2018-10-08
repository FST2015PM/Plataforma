(function() {
    'use strict';

    angular
        .module('FST2015PM.controllers')
        .controller('GridsterCtrl', GridsterCtrl);

    GridsterCtrl.$inject = ["$scope", "$timeout", "$uibModal"];
    function GridsterCtrl($scope, $timeout, $uibModal) {
        $scope.widgets = [{id:1, sizex: 2, sizey:2, row:1, col:1, content:'<p>Válvula</p>'}, {id:2, sizex: 1, sizey:1, row:1, col:2, content:'<p>Botón</p>'}];
        var gridster;

        $timeout(function() {
            gridster = $(".gridster ul").gridster({
                widget_base_dimensions: ['auto', 140],
                autogenerate_stylesheet: true,
                min_cols: 1,
                max_cols: 6,
                widget_margins: [5, 5],
                resize: {
                    enabled: true
                }
            }).data('gridster');
            $('.gridster  ul').css({'padding': '0'});
        }, 50);

        $scope.addWidget = function () {
            var instance = $uibModal.open({
                templateUrl:'templates/addWidgetModal.html',
                controller: 'AddWidgetCtrl'
            });

            $scope.serializeDashboard = function() {
                console.log(gridster.serialize());
            };

            instance.result
                .then(function(selectedItem) {
                    $scope.widgets.push({id:2, sizex: 1, sizey:1, row:1, col:1, content:'<p>Nuevo</p>'});
                });
        };
    }

})();
