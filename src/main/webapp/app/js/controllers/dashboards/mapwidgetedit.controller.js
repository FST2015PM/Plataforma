(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('MapEditWidgetCtrl', MapEditWidgetCtrl);

  MapEditWidgetCtrl.$inject = ["$state","$stateParams", "$Datasource", "$GeoLayer"];
  function MapEditWidgetCtrl($state, $stateParams, $Datasource, $GeoLayer) {
    let cnt = this;
    cnt.dashboardData = {};
    cnt.widget = {};
    cnt.addedLayers = [];
    cnt.layerList = [];
    cnt.iLayer;

    $GeoLayer.listGeoLayers()
    .then(res => {
      if (res.data && res.data.length) {
        cnt.layerList = res.data.filter(function(layer) {
          return layer.type === "geojson" || layer.type === "shp";
        });
      }
    });

    if($stateParams.id && $stateParams.id.length && $stateParams.wid && $stateParams.wid.length) {
      $Datasource.getObject($stateParams.id, "Dashboard").then(ds => {
        cnt.dashboardData = ds.data;

        let widgetIdx;
        let addedIds = [];
        cnt.dashboardData.widgets.forEach((item, idx) => {
          if (item.id === $stateParams.wid) {
            widgetIdx = idx;
          }
        });

        cnt.widget = cnt.dashboardData.widgets.splice(widgetIdx, 1)[0];
        cnt.addedLayers = cnt.widget.layers || [];
        addedIds = cnt.addedLayers.map(l => {
          return l._id;
        });

        cnt.layerList = cnt.layerList.filter(l => {
          return !addedIds.includes(l._id);
        });
      });
    }

    cnt.removeAddedLayer = function(layerId) {
      let tLayerIndex;
      cnt.addedLayers.forEach((item, idx) => {
        if (item._id === layerId) {
          tLayerIndex = idx;
        }
      });

      let tLayer = cnt.addedLayers.splice(tLayerIndex, 1);
      cnt.layerList.push(tLayer[0]);
    };

    cnt.addILayer = function() {
      if (!cnt.iLayer) return;
      cnt.iLayer.markerColor = cnt.markerColor;
      cnt.iLayer.polygonColor = cnt.polygonColor;
      cnt.addedLayers.push(cnt.iLayer);
      cnt.layerList = cnt.layerList.filter((item) => {
        return item._id !== cnt.iLayer._id;
      });

      cnt.iLayer = {};
      cnt.setMarkerColor('black');
    };

    cnt.setMarkerColor = function(color) {
      cnt.markerStyle = {color: color};
      cnt.markerColor = color;
    };

    cnt.setPolygonColor = function(color) {
      cnt.polygonStyle = {color: color};
      cnt.polygonColor = color;
    };

    cnt.submitForm = function(form) {
      if (form.$valid) {
        let ld = cnt.addedLayers.map(item => {
          return {
            _id: item._id,
            name: item.name,
            description: item.description,
            resourceURL: item.resourceURL,
            type: item.type,
            markerColor: item.markerColor
          }
        });

        cnt.widget.layers = ld;
        cnt.dashboardData.widgets.push(cnt.widget);

        if (cnt.dashboardData._id) {
          $Datasource.updateObject(cnt.dashboardData, "Dashboard")
          .then(response => {
            $state.go('admin.editdashboard', {id: cnt.dashboardData._id});
          })
        }
      }
    };

  };

})();
