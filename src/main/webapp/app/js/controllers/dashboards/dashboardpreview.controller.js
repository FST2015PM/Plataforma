(function() {
    'use strict';

    angular
        .module('FST2015PM.controllers')
        .controller('PreviewDashboardCtrl', PreviewDashboardCtrl);

    PreviewDashboardCtrl.$inject = ["$state","$stateParams", "$Datasource","$http", "uuid"];
    function PreviewDashboardCtrl($state, $stateParams, $Datasource, $http, uuid) {
        var cnt = this;
        cnt.dashboardData = {};
        cnt.gridsterOptions = {
            margins: [5, 5],
            mobileModeEnabled: true,
            resizable: { enabled: false },
            draggable: { enabled: false }
        };

        if($stateParams.id && $stateParams.id.length) {
            $Datasource.getObject($stateParams.id, "Dashboard").then(function(ds) {
                cnt.dashboardData = ds.data;
            });
        }

    }

})();
