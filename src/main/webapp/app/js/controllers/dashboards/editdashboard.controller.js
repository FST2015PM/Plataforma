(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('editDashboardCtrl', editDashboardCtrl)
    ;

  editDashboardCtrl.$inject = ["$scope", "$state","$stateParams", "$Datasource","$http"];
  function editDashboardCtrl($scope, $state, $stateParams, $Datasource, $http) {

    var deletedWidgets = [];

    $scope.gridsterOptions = {
      columns: 6,
        pushing: true,
      margins: [5, 5],
      mobileModeEnabled: true
    };

    //get dashboards and widgets from database
    if ($stateParams.id && $stateParams.id.length) {
      $Datasource.getObject($stateParams.id, "Dashboard").then(
        function(dashboard) {
          var widgets = dashboard.data.widgets;
          $scope.dashboard = dashboard.data;
          $scope.dashboard.name = dashboard.data.name;
          $scope.dashboard.widgets = [];

          for(var key in widgets) {
            $Datasource.getObject(widgets[key]._id, "Widget").then(function(widget) {
              $scope.dashboard.widgets.push(widget.data);
              setTimeout(function () {
                $scope.addWidgetContent(widget.data, widget.data.type);
              }, 1000);
            }).catch(function (error) {
              console.log(error);
            });
          }
        }
      );

      $scope.pageTitle = "Editar dashboard";

    } else {


      var newDashboard = {
        name: "",
        widgets: []
      }

      $scope.pageTitle = "Nuevo dashboard";
      $scope.dashboard = newDashboard;
    }

    if ($stateParams.mode == "view") {

      $scope.gridsterOptions.draggable = false;
      $scope.gridsterOptions.resizable = false;
      $scope.formVisible = false;
      $scope.desactiveClass = "desactive-element";

    } else {

      $scope.gridsterOptions.draggable = {
        enabled: true,
        handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw']
      };
      $scope.gridsterOptions.resizable = {
        enabled: true
      };
      $scope.formVisible = true;
    }

    $scope.returnPage = function($event) {
      $state.go('admin.dashboards',{});
    }

    $scope.addWidget = function() {
      if ($scope.formVisible) {
        $.get('templates/dashboard/widgetEditForm.html',function(template) {
          bootbox.confirm(template, function(result) {
            if (result) {
              var data = {};

              //get form data
              data.name = $('#widgetFormName').val();
              data.type = $('#widgetFormType').val();

              if (data.name.length < 1) {
                data.name = 'widget';
              };

              $scope.$apply(function() {
                var itemId = Date.now();
                var widget = {
                      _id: itemId,
                      name: data.name,
                      type: data.type,
                      content: '<div id="content-'+itemId+'" class="gridster-angular-content-item"></div>',
                      sizeX: 1,
                      sizeY: 1
                    }
                $scope.dashboard.widgets.push(widget);
                setTimeout(function() {
                  $scope.addWidgetContent(widget, data['type']);
                }, 1000);
              });
              $scope.dashboard.widgets
            };
          });
        });
      };
    };

    $scope.editWidget = function($event) {
      if ($scope.formVisible) {
        var widgetId = $event.target.id;
        $.get('templates/dashboard/widgetEditForm.html', function(template) {
          bootbox.confirm(template, function (result){
            if(result) {

              var data = {};

              //get form data
              data.name = $('#widgetFormName').val();
              data.type = $('#widgetFormType').val();

              $scope.$apply(function() {
                for(var i=0 ; i < $scope.dashboard.widgets.length; i++) {
                  if($scope.dashboard.widgets[i]._id == widgetId) {
                    if (data['name'].length) {
                      $scope.dashboard.widgets[i].name = data['name'];
                    };
                    if (data['type'].length) {
                      var widget = $scope.dashboard.widgets[i].type = data['type'];
                      setTimeout(function() {
                        $scope.addWidgetContent(widget, data['type']);
                      }, 1000);
                    };
                  };
                };
              });
            };
          });
        });
      };
    };

    $scope.$on('gridster-item-initialized', function(item) {
      //$scope.addWidgetContent($scope.dashboard.widgets[i], data['type']);
      console.log(item.$element);
      console.log(item.gridster);
    });

    $scope.addWidgetContent = function (widget, type) {

      var cadena = new String(widget._id);
      if (cadena.indexOf(':') != -1) {
        var widgetId = widget._id.split(':').join('\\:');
      } else {
        var widgetId = widget._id;
      }
      switch(type) {
        case "map":
          var mochis = [25.793, -108.977];
          dataviz.mapsFactory.createMap(
            $('#content-'+ widgetId)[0],
            ENGINE_GOOGLEMAPS,
            mochis,
            10,
            function(map, container){
              console.log(map);
            }
          );
        break;
        case "table":
          var request = $http({
              url: "/app/mockdata/datatables.json",
              method: "GET"
            })
            .then(function(res) {
              $.get('templates/datatables.html', function(template) {
                $('#content-'+widgetId).css('overflow','auto');
                $('#content-'+widgetId).append(template);
                dataviz.dataTablesFactory.createDataTable('content-'+widgetId+" > table", res.data);
              })
            });
        break;
        case "chart":
          var request = $http({
            url: "/app/mockdata/piedata.json",
            method: "GET"
          }).then(function(res) {
            var options = {};
            options.height = $('#content-'+widgetId).height();
            options.width = $('#content-'+widgetId).width();
            dataviz.chartsFactory.createChart('content-'+widgetId, res.data, null, options);
            $('#content-'+ widgetId).on("change", function(item){
              console.log(item);
            })
          });
        break;
        default:
          console.log("bad type of content");
      }
    }

    $scope.save = function() {

      if (!$scope.formVisible) {
        return;
      };

      var dashboard = {};
      var widgetsObject = {};
      var indice = 0;
      var total = $scope.dashboard.widgets.length;

      dashboard._id = $scope.dashboard._id;
      dashboard.name = $scope.dashboard.name;
      dashboard.widgets = {};

      for(var i=0 ; i < $scope.dashboard.widgets.length; i++) {
        var widget = {};

        widget._id = $scope.dashboard.widgets[i]._id;
        widget.name = $scope.dashboard.widgets[i].name;
        widget.type = $scope.dashboard.widgets[i].type
        widget.col = $scope.dashboard.widgets[i].col;
        widget.row = $scope.dashboard.widgets[i].row;
        widget.sizeX = $scope.dashboard.widgets[i].sizeX;
        widget.sizeY = $scope.dashboard.widgets[i].sizeY;

        $Datasource.getObject(widget._id, "Widget")
        .then(function(result) {
          $Datasource.updateObject(widget,"Widget")
          .then(function(result) {
            saveDashboard({"_id": widget._id, "name": widget.name });
          });
        })
        .catch(function(error) {
          delete widget['_id'];
          $Datasource.addObject(widget,"Widget")
          .then(function(result) {
            saveDashboard({"_id":result.data.response.data._id, "name": result.data.response.data.name });
          });
        });
      };

      function deleteWidgets() {
        //delete widgets from the database
        for (var i = 0; i < deletedWidgets.length; i++) {
          var widget ={};
          widget._id = deletedWidgets[i]._id;
          $Datasource.removeObject(widget._id, "Widget").catch(function(error) {});
        };
      }

      function saveDashboard(widget) {
        widgetsObject[indice] = widget;
        indice++;
        if (total == indice) {
          dashboard.widgets = widgetsObject;
          if (dashboard._id) {
            $Datasource.updateObject(dashboard,"Dashboard")
            .then(function(response){
              $state.go('admin.dashboards',{})
            })
            .catch(function(error){
              console.log(error);
            })
          } else {
            $Datasource.addObject(dashboard, "Dashboard")
            .then(function(response){
              $state.go('admin.dashboards', {});
            })
            .catch(function(error){
              console.log(error);
            });
          }
        };
      };
    }

    $scope.deleteWidget = function($event) {
      if ($scope.formVisible) {
        var widgetId = $event.target.id;
        for(var i=0 ; i < $scope.dashboard.widgets.length; i++) {
          if($scope.dashboard.widgets[i]._id == widgetId) {
            deletedWidgets.push(widgetId);
            $scope.dashboard.widgets.splice(i, 1);
          };
        };
      };
    };

    $scope.clear = function() {
      if ($scope.formVisible) {
        $.each($scope.dashboard.widgets, function(index, value) {
          deletedWidgets.push(value._id);
        });

        $scope.dashboard.widgets = [];
      };
    };

    $scope.$on('gridster-item-resized', function(item){ console.log(item); });

  };

})();
