(function() {
    'use strict';

    angular
        .module("FST2015PM.controllers")
        .controller("DashboardCtrl", DashboardCtrl);

    DashboardCtrl.$inject = ["$Datasource", "$stateParams", "$state","$scope"];
    function DashboardCtrl($Datasource, $stateParams, $state, $scope) {
        var context = this;
        context.formTitle = "Agregar Dashboard";
        context.dashboardLsist = [];

        $Datasource.listObjects("Dashboard").then(function(res) {
            context.dashboardList = res.data.data;
        });

        $scope.deleteDashboard = function(dashboardId) {
            bootbox.confirm("¿está seguro de eliminar el dashboard?", function(result) {
                if (result) {
                    if (dashboardId) {
                        $Datasource.removeObject(dashboardId,"Dashboard")
                            .then(function(resp) {
                                $state.reload();
                            })
                            .catch(function(error) {
                                console.log(error.message);
                                bootbox.alert("Error al borrar intentelo más tarde");
                            });
                    }
                }
            });
        }
    }
})();
