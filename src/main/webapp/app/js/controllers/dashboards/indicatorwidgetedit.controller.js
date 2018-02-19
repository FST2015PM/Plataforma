(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('IndicatorEditWidgetCtrl', IndicatorEditWidgetCtrl);

  IndicatorEditWidgetCtrl.$inject = ["$state","$stateParams", "$Datasource", "$GeoLayer"];
  function IndicatorEditWidgetCtrl($state, $stateParams, $Datasource, $GeoLayer) {
    let cnt = this;
    cnt.dashboardData = {};
    cnt.widget = {};
    cnt.dsList = {};
    cnt.dsColumns = [];

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

        let widgetIdx;
        let addedIds = [];
        cnt.dashboardData.widgets.forEach((item, idx) => {
          if (item.id === $stateParams.wid) {
            widgetIdx = idx;
          }
        });

        cnt.widget = cnt.dashboardData.widgets.splice(widgetIdx, 1)[0];
        cnt.widget.indicatorType = cnt.widget.indicatorType || "label";

        cnt.updateDSDefinition();
      });
    }

    cnt.updateDSDefinition = function() {
      $Datasource.listObjects("DBDataSource", [{name:'name', value: cnt.widget.dataSourceName}])
      .then(function(result) {
        if (result.data && result.data.data) {
          cnt.dsColumns = result.data.data[0].columns || [];
          cnt.dsColumns = cnt.dsColumns.filter(function(item) {
            return item.type === "integer" || item.type === "float" || item.type === "double" || item.type === "long";
          }).map(function(item) {
            return item.name;
          });
        }
      });
    };

    cnt.setIndicatorType = function(type) {
      //console.log(type);
      cnt.widget.indicatorType = type;
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

  };

})();
