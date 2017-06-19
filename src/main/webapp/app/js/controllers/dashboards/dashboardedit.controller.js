(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('EditDashboardCtrl', EditDashboardCtrl);

  EditDashboardCtrl.$inject = ["$state","$stateParams", "$Datasource", "uuid", "$timeout"];
  function EditDashboardCtrl($state, $stateParams, $Datasource, uuid, $timeout) {
    let cnt = this;
    let renderers = [];
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
      minSizeX: 1,
      minSizeY: 1,
      resizable: {
        enabled: true,
        stop: function(event, $element, widget) {
          let m;
          renderers.forEach(item => {
            if (widget.id === item.id) {
              m = item;
            }
          });

          if (m) {
            if (m.type === "map") {
              m.map.invalidateSize();
            }
            if (m.type==="gauge" || m.type==="chart") {
              m.chart.reflow();
            }
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
              var mp = dataviz.mapsFactory.createMap(item.id, ENGINE_LEAFLET, [40.46, -100.715], 3, true);

              item.layers && item.layers.forEach(function(layer) {
                console.log("Rendering layer "+layer.name);
                $.getJSON(layer.resourceURL, function (geojson) {
                  dataviz.mapsFactory.addGeoJSONLayer(mp, geojson, ENGINE_LEAFLET, false, true, layer.name);
                });
              });

              renderers.push({id: item.id, type: "map", map: mp});
            } else if (item.type === "indicator") {
              $Datasource.aggregate(item.dataSourceName, item.groupField, item.showValue).then(function(ret){
                if (ret.response && ret.response.data) {
                  if (item.indicatorType === "label") {
                    renderers.push({id: item.id, type:"label", chart: dataviz.chartsFactory.createLabel(item.id, parseFloat(ret.response.data[0].result).toFixed(2), item.unit || "")});
                  } else if (item.indicatorType === "gauge") {
                    renderers.push({id: item.id, type:"gauge", chart: dataviz.chartsFactory.createGauge(item.id, "", parseFloat(ret.response.data[0].result).toFixed(2), 0, 50000, item.unit || "")});
                  }
                }
              });
            } else if (item.type === "chart") {
              console.log(item);
              var data = {};

              if (!item.groupValues) {
                $Datasource.listObjects(item.dataSourceName).then(function(res) {
                  data = processChartData(res, item.groupField, item.valField);
                  data.title = item.name;
                  data.xAxisTitle = item.xAxisTitle;
                  data.yAxisTitle = item.yAxisTitle;

                  if (item.chartType === "bar") {
                      renderers.push({id: item.id, type:"chart", chart: dataviz.chartsFactory.createBarChart(item.id, data)});
                  } else if (item.chartType === "line") {
                      renderers.push({id: item.id, type:"chart", chart: dataviz.chartsFactory.createLineChart(item.id, data)});
                  }
                });
              } else {
                $Datasource.aggregate(item.dataSourceName, item.valField, item.showValue, item.groupField).then(function(ret){
                  data = processChartData(ret);
                  data.title = item.name;
                  data.xAxisTitle = item.xAxisTitle;
                  data.yAxisTitle = item.yAxisTitle;

                  if (item.chartType === "bar") {
                      renderers.push({id: item.id, type:"chart", chart: dataviz.chartsFactory.createBarChart(item.id, data)});
                  } else if (item.chartType === "line") {
                      renderers.push({id: item.id, type:"chart", chart: dataviz.chartsFactory.createLineChart(item.id, data)});
                  }
                });
              }
            }
          });
        }, 500);
      });
    }

    cnt.addWidget = function(type) {
      let wid = uuid.v4().replace(/-/g, '');
      let minX = 2, minY = 2;

      if ("map" === type) {
        minX = minY = 3;
      }
      if ("indicator" === type) {
        minX = 1;
        minY = 2;
      }
      cnt.widgets.push({
        id: wid,
        name:type,
        type:type,
      	minSizeY: minX,
      	minSizeX: minY,
        sizeX: minX,
        sizeY: minY
      });
    };

    cnt.removeWidget = function(widgetId) {
      cnt.widgets = cnt.widgets.filter((item) => {
        return item.id !== widgetId;
      });
    };

    cnt.configWidget = function(widget) {
      var state = "";
      if ("indicator" === widget.type) state = "admin.editindicatorwidget";
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

  function processChartData(result, catField, valField) {
    var d=[], ret = {};

    ret.categories = [];
    ret.series = [];
    ret.series.push({values: []});

    if (result.response) { //Aggregation
      d = result.response.data || [];
      d.forEach(function(item) {
        ret.categories.push(item._id);
        ret.series[0].values.push(item.result);
      });
    } else {
      d = result.data.data || [];
      d.forEach(function(item) {
        ret.categories.push(item[catField]);
        ret.series[0].values.push(item[valField]);
      });
    }

    console.log(ret);
    return ret;
  };

})();
