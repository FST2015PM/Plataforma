(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('EditDashboardCtrl', EditDashboardCtrl);

  EditDashboardCtrl.$inject = ["$state","$stateParams", "$Datasource", "uuid", "$timeout"];
  function EditDashboardCtrl($state, $stateParams, $Datasource, uuid, $timeout) {
    let cnt = this;
    let maps = [];
    cnt.widgets = [];
    cnt.formTitle = "Agregar tablero";
    cnt.dashboardData = {};
    cnt.gridsterOptions = {
      columns: 6,
      pushing: true,
      margins: [5, 5],
      mobileModeEnabled: true,
      defaultSizeX:2,
      defaultSizeY:2,
      minSizeX: 2,
      minSizeY: 2,
      resizable: {
        enabled: true,
        stop: function(event, $element, widget) {
          let m;
          maps.forEach(item => {
            if (widget.id === item.id) {
              m = item.map;
            }
          });

          if (m) {
            m.invalidateSize();
          }
        }
      },
      draggable: {
        enabled: true,
        handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw']
      }
    };

    if($stateParams.id && $stateParams.id.length) {
      cnt.formTitle = "Editar tablero";
      $Datasource.getObject($stateParams.id, "Dashboard").then(ds => {
        cnt.dashboardData = ds.data;
        cnt.widgets = ds.data.widgets;

        $timeout(() => {
          cnt.widgets.forEach((item) => {
            if (item.type === "map") {
              maps.push({id: item.id, map: dataviz.mapsFactory.createMap(item.id, ENGINE_LEAFLET, [40.46, -100.715], 3)});
            }
          });
        }, 500);
      });
    }

    cnt.addWidget = function(type) {
      let wid = uuid.v4().replace(/-/g, '');
      let minSize = 2;

      if ("map" === type) minSize = 3;
      cnt.widgets.push({
        id: wid,
        name:type,
        type:type,
      	minSizeY: minSize,
      	minSizeX: minSize
      });
    };

    cnt.removeWidget = function(widgetId) {
      cnt.widgets = cnt.widgets.filter((item) => {
        return item.id !== widgetId;
      });
    };

    cnt.configWidget = function(widget) {
      var state = "";
      if ("map" === widget.type) state = "admin.editmapdwidget";
      if ("chart" === widget.type) state = "admin.editchartwidget";
      if ("table" === widget.type) state = "admin.edittablewidget";
      $state.go(state, {id: $stateParams.id, wid: widget.id});
    };

    cnt.clear = function() {
      cnt.widgets = [];
    };

    cnt.submitForm = function(form) {
      if (form.$valid) {
        cnt.dashboardData.widgets = cnt.widgets;
        if (!cnt.dashboardData._id) {
          $Datasource.addObject(cnt.dashboardData, "Dashboard")
          .then(response => {
            $state.go('admin.dashboards', {});
          })
        } else {
          $Datasource.updateObject(cnt.dashboardData, "Dashboard")
          .then(response => {
            $state.go('admin.dashboards', {});
          })
        }
      }
    };

  };

})();
