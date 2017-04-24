(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('EditDashboardCtrl', EditDashboardCtrl);

  EditDashboardCtrl.$inject = ["$state","$stateParams", "$Datasource","$http", "uuid", "$uibModal"];
  function EditDashboardCtrl($state, $stateParams, $Datasource, $http, uuid, $uibModal) {
    let cnt = this;
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
      resizable: { enabled: true },
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
      });
    }

    cnt.addWidget = function(type) {
      let wid = uuid.v4().replace(/-/g, '');

      cnt.widgets.push({
        id: wid,
        name:type,
      	minSizeY: 2,
      	minSizeY: 2
      });
    };

    cnt.removeWidget = function(widgetId) {
      cnt.widgets = cnt.widgets.filter((item) => {
        return item.id !== widgetId;
      });
    };

    cnt.configWidget = function() {
      console.log("alo");
      let instance = $uibModal.open({
        template:'<p>Hi</p>',
        controller: function() {}
      });
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
