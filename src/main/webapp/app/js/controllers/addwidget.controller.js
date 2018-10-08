(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('AddWidgetCtrl', AddWidgetCtrl);

    AddWidgetCtrl.$inject = ["$scope", "$uibModalInstance"];
    function AddWidgetCtrl($scope, $uibModalInstance) {
      var c = this;
      $scope.widgetTypes = [{id:1, name:"Válvula"}, {id:2, name:"Etiqueta"}, {id:3, name:"Botón"}, {id:4, name:"Gráfica"}];
      $scope.selectedItem = 0;

      $scope.ok = function () {
        //console.log($scope.selectedItem);
        $uibModalInstance.close($scope.selectedItem);
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

    }

})();
