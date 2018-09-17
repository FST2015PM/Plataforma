(function() {
    'use strict';

    angular
        .module('FST2015PM.controllers')
        .controller('ChartEditWidgetCtrl', ChartEditWidgetCtrl);

    ChartEditWidgetCtrl.$inject = ["$state","$stateParams", "$Datasource", "$GeoLayer"];
    function ChartEditWidgetCtrl($state, $stateParams, $Datasource, $GeoLayer) {
        var cnt = this;
        cnt.dashboardData = {};
        cnt.widget = {};
        cnt.dsList = {};
        cnt.dsColumns = [];
        cnt.dsYColumns = [];

        $Datasource.listDatasources()
            .then(function(res) {
                if (res.data && res.data.length) {
                    cnt.dsList = res.data;
                    cnt.dsList = cnt.dsList.map(function(item) { return {id: item.name, name: item.name} });
                }
            });

        if($stateParams.id && $stateParams.id.length && $stateParams.wid && $stateParams.wid.length) {
            $Datasource.getObject($stateParams.id, "Dashboard")
                .then(function(ds) {
                    cnt.dashboardData = ds.data;

                    var widgetIdx;
                    var addedIds = [];
                    cnt.dashboardData.widgets.forEach(function(item, idx) {
                        if (item.id === $stateParams.wid) {
                            widgetIdx = idx;
                        }
                    });

                    cnt.widget = cnt.dashboardData.widgets.splice(widgetIdx, 1)[0];
                    cnt.widget.chartType = cnt.widget.chartType || "bar";

                    cnt.updateDSDefinition();
                });
        }

        cnt.updateDSDefinition = function() {
            $Datasource.listObjects("DBDataSource", [{name:'name', value: cnt.widget.dataSourceName}])
                .then(function(result) {
                    if (result.data && result.data.data.length) {
                        var cols = result.data.data[0].columns || [];
                        //cnt.dsColumns = result.data.data[0].columns || [];

                        cnt.dsYColumns = cols.filter(function(item) {
                            return item.type === "integer" || item.type === "float" || item.type === "double" || item.type === "long";
                        }).map(function(item) {
                            return item.name;
                        });

                        cnt.dsColumns = cols.map(function(item) {
                            return item.name;
                        });
                    }
                });
        };

        cnt.setChartType = function(type) {
            cnt.widget.chartType = type;
        };

        cnt.submitForm = function(form) {
            if (form.$valid) {
                cnt.dashboardData.widgets.push(cnt.widget);

                if (cnt.dashboardData._id) {
                    $Datasource.updateObject(cnt.dashboardData, "Dashboard")
                        .then(function(response) {
                            $state.go('admin.editdashboard', {id: cnt.dashboardData._id});
                        });
                }
            }
        };

    }

})();
