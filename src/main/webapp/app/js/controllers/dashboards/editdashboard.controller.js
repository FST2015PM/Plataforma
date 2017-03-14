(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('editDashboardCtrl', editDashboardCtrl)
    ;

  editDashboardCtrl.$inject = ["$scope", "$state","$stateParams", "$Datasource"];
  function editDashboardCtrl($scope, $state, $stateParams, $Datasource) {

    let deletedWidgets = [];

    let newDashboard = {
      name: "",
      widgets: []
    }

    if ($stateParams.id && $stateParams.id.length) {
      $Datasource.getObject($stateParams.id, "Dashboard").then(
        dashboard => {
          var widgets = dashboard.data.widgets;
          $scope.dashboard = dashboard.data;
          $scope.dashboard.name = dashboard.data.name;
          $scope.dashboard.widgets = [];

          for(var key in widgets) {
            $Datasource.getObject(widgets[key]._id, "Widget").then(widget => {
              $scope.dashboard.widgets.push(widget.data);
            }).catch(error => {
              console.log(error);
            });
          }
        }
      );

      $scope.pageTitle = "Editar dashboard";

    } else {
      $scope.pageTitle = "Nuevo dashboard";
      $scope.dashboard = newDashboard;
    }

    if ($stateParams.mode == "view") {

      $scope.gridsterOptions = {
        columns: 6,
        pushing: true,
        margins: [5, 5],
        mobileModeEnabled: true,
        draggable: false,
        resizable: false
      };

      $scope.formVisible = false;
      $scope.desactiveClass = "desactive-element";

    } else {

      $scope.gridsterOptions = {
        columns: 6,
        pushing: true,
        margins: [5, 5],
        mobileModeEnabled: true,
        draggable: {
          enabled: true,
          handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw']
        },
        resizable: {
          enabled: true
        }
      };

      $scope.formVisible = true;
    }

    $scope.addWidget = function() {
      let itemId = Date.now();
      $scope.dashboard.widgets.push({
        _id: itemId,
        name: 'widget',
        content: '<div class="gridster-angular-content-item"></div>',
        sizeX: 1,
        sizeY: 1
      });
    };

    $scope.editWidget = function($event) {
      let widgetId = $event.target.id;
      $.get('templates/dashboard/widgetEditForm.html', function(data) {
        bootbox.confirm(data, function(result) {
          if(result) {

            var data = {};

            $("#widgetForm input").each(function(index, value ) {
              data[$(value).attr('name')] = $(value).val();
            });

            $scope.$apply(function() {
              for(var i=0 ; i < $scope.dashboard.widgets.length; i++) {
                if($scope.dashboard.widgets[i]._id == widgetId) {
                  if (data['name'].length) {
                    $scope.dashboard.widgets[i].name = data['name'];
                  };
                  if (data['ancho'].length && $.isNumeric(data['ancho'])) {
                    $scope.dashboard.widgets[i].sizeX = data['ancho'];
                  };
                  if (data['alto'].length && $.isNumeric(data['alto'])) {
                    $scope.dashboard.widgets[i].sizeY = data['alto'];
                  };
                  if (data['row'].length && $.isNumeric(data['row'])) {
                    $scope.dashboard.widgets[i].row = data['row'];
                  };
                  if (data['col'].length && $.isNumeric(data['col'])) {
                    $scope.dashboard.widgets[i].col = data['col'];
                  };
                }
              }
            });

          }
        });
      });
    };

    $scope.save = function() {

      let dashboard = {};
      let widgetsObject = {};
      let indice = 0;
      let total = $scope.dashboard.widgets.length;

      dashboard._id = $scope.dashboard._id;
      dashboard.name = $scope.dashboard.name;
      dashboard.widgets = {};

      for (var i = 0; i < deletedWidgets.length; i++) {
        let widget ={};
        widget._id = deletedWidgets[i]._id;
        $Datasource.removeObject(widget._id, "Widget")
        .catch(function(error) {});
      };

      for(var i=0 ; i < $scope.dashboard.widgets.length; i++) {
        let widget = {};

        widget._id = $scope.dashboard.widgets[i]._id;
        widget.name = $scope.dashboard.widgets[i].name;
        widget.type = "undefined"
        widget.col = $scope.dashboard.widgets[i].col;
        widget.row = $scope.dashboard.widgets[i].row;
        widget.sizeX = $scope.dashboard.widgets[i].sizeX;
        widget.sizeY = $scope.dashboard.widgets[i].sizeY;

        $Datasource.getObject(widget._id, "Widget")
        .then(function(result){
          saveDashboard({"_id": widget._id, "name": widget.name });
        })
        .catch(function(error){
          delete widget['_id'];
          $Datasource.addObject(widget,"Widget")
          .then(function(result) {
            saveDashboard({"_id":result.data.response.data._id, "name": result.data.response.data.name });
          });
        });
      };

      function saveDashboard(widget) {
        widgetsObject[indice] = widget;
        indice++;
        if (total == indice) {
          dashboard.widgets = widgetsObject;
          if (dashboard._id) {
            $Datasource.updateObject(dashboard,"Dashboard")
            .then(response => {
              $state.go('dashboard.dashboards',{})
            }).catch(error => {
              console.log(error);
            })
          } else {
            $Datasource.addObject(dashboard, "Dashboard")
            .then(response => {
              $state.go('dashboard.dashboards', {});
            })
            .catch(error => {
              console.log(error);
            })
          }
        };
      };

    }

    $scope.deleteWidget = function($event) {
      let widgetId = $event.target.id;
      for(var i=0 ; i < $scope.dashboard.widgets.length; i++) {
        if($scope.dashboard.widgets[i]._id == widgetId) {
          deletedWidgets.push(widgetId);
          $scope.dashboard.widgets.splice(i, 1);
        }
      }
    }

    $scope.clear = function() {

      $.each($scope.dashboard.widgets, function(index, value) {
        deletedWidgets.push(value._id);
      });

      $scope.dashboard.widgets = [];
    };
  };

})();
