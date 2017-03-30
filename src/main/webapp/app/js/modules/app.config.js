(function() {
  'use strict';

  angular
    .module('FST2015PM')
    .config(config)
    .run(run);

  config.$inject = ["$stateProvider", "$urlRouterProvider"];
  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('dashboard', {
        abstract: true,
        url: "/dashboard",
        templateUrl: "templates/container.html"
      })
      .state('dashboard.main', {
        url: "/",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {

          }
        },
        resolve: {
          menuItems: function() {
            return dashboardMenuItems;
          }
        }
      })
      /*.state('dashboard.maps', {
        url: "/maps",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/maps.html',
            controller: "MapsCtrl as maps"
          }
        },
        resolve: {
          menuItems: function() {
            return dashboardMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  files: [
                    'lib/leaflet/dist/leaflet.css',
                    'lib/leaflet/dist/leaflet.js',
                    'lib/leaflet.geoCSV/leaflet.geocsv-src.js',
                    'lib/leaflet.geoCSV/leaflet.geocsv.js',                
                    'lib/google-maps/lib/Google.min.js',
                    'js/dataviz/constants.js',
                    'js/dataviz/charts.js',
                    'js/dataviz/maps.js',
                    'js/dataviz/datatables.js',
                    'js/dataviz/dataviz.js',
                    'lib/d3/d3.min.js',
                  ]
              }
            ]);
          }
        }
      })
      .state('dashboard.charts', {
        url: "/charts",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/charts.html',
            controller: "ChartsCtrl as charts"
          }
        },
        resolve: {
          menuItems: function() {
            return dashboardMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  files: [
                    'lib/d3/d3.min.js',
                    'js/dataviz/constants.js',
                    'js/dataviz/charts.js',
                    'js/dataviz/maps.js',
                    'js/dataviz/datatables.js',
                    'js/dataviz/dataviz.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('dashboard.datatables', {
        url: "/datatables",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/datatables.html',
            controller: "DataTablesCtrl as datatables"
          }
        },
        resolve: {
          menuItems: function() {
            return dashboardMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {   serie: true,
                  files: [
                    'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/gijgo/dist/combined/js/gijgo.min.js',
                    'lib/gijgo/dist/combined/js/gijgo.js',
                    'js/dataviz/constants.js',
                    'js/dataviz/charts.js',
                    'js/dataviz/maps.js',
                    'js/dataviz/datatables.js',
                    'js/dataviz/dataviz.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('dashboard.gridster', {
        url: "/gridster",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/gridster.html',
            controller: "GridsterCtrl as gridster"
          }
        }
      })
      .state('dashboard.gridsterAngular', {
        url: "/gridsterAngular",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/gridsterAngular.html',
            controller: "GridsterAngularCtrl as gristerAngular"
          }
        },
        resolve: {
          menuItems: function() {
            return dashboardMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  files: [
                    'lib/angular-gridster/dist/angular-gridster.min.css',
                    'lib/angular-gridster/dist/angular-gridster.min.js',
                  ]
              }
            ]);
          }
        }
      })*/
      .state('admin.endpoints', {
        url: '/endpoints',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/endpoints/endpoints.html',
            controller: 'EndpointCtrl',
            controllerAs: "endpoint"
          }
        },
        resolve: {
          menuItems: function() {
            return dashboardMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/bootbox/bootbox.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin', {
        abstract: true,
        url: "/admin",
        templateUrl: "templates/container.html"
      })
      .state('admin.dashboards', {
        url: '/dashboards',
        params: {
          id: null
        },
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/dashboard/dashboards.html',
            controller: 'DashboardListCtrl',
            controllerAs: "dashboards"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  files: [
                    'lib/angular-gridster/dist/angular-gridster.min.js',
                    'lib/angular-bootstrap/ui-bootstrap.min.js',
                    'lib/bootbox/bootbox.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.editdashboard', {
        url: '/:mode/dashboard/:id',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/dashboard/editDashboard.html',
            controller: 'editDashboardCtrl',
            controllerAs: "editdashboard"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/bootbox/bootbox.js',
                    'lib/d3/d3.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/angular-gridster/dist/angular-gridster.min.css',
                    'lib/angular-gridster/dist/angular-gridster.min.js',
                    'lib/google-maps/lib/Google.min.js',
                    'js/dataviz/constants.js',
                    'js/dataviz/charts.js',
                    'js/dataviz/maps.js',
                    'js/dataviz/datatables.js',
                    'js/dataviz/dataviz.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.main', {
        url: "/",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/admin.html'
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          }
        }
      })
      .state('admin.pmcatalog', {
        url: "/pm",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/magictowns/pmcatalog.html',
            controller: "PMCatalog",
            controllerAs: "mtown"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  files: [
                    //'js/dataviz/constants.js',
                    //'js/dataviz/charts.js',
                    //'js/dataviz/maps.js',
                    //'js/dataviz/datatables.js',
                    //'js/dataviz/dataviz.js',
                    'lib/bootbox/bootbox.js',
                    'lib/ng-file-upload/ng-file-upload-shim.min.js',
                    'lib/ng-file-upload/ng-file-upload.min.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.addpm', {
        url: "/pm/add",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/magictowns/pmEdit.html',
            controller: "PMEditCatalog",
            controllerAs: "mtown"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  files: [
                    //'lib/datatables.net/js/jquery.dataTables.min.js',
                    //'js/dataviz/constants.js',
                    //'js/dataviz/charts.js',
                    //'js/dataviz/maps.js',
                    //'js/dataviz/datatables.js',
                    //'js/dataviz/dataviz.js',
                    'lib/moment/moment.js',
                    'lib/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
                    'lib/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
                    'lib/bootbox/bootbox.js',
                    'lib/ng-file-upload/ng-file-upload-shim.min.js',
                    'lib/ng-file-upload/ng-file-upload.min.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.editpm', {
        url: "/pm/edit/:id",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/magictowns/pmEdit.html',
            controller: "PMEditCatalog",
            controllerAs: "mtown"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  files: [
                    //'lib/datatables.net/js/jquery.dataTables.min.js',
                    //'js/dataviz/constants.js',
                    //'js/dataviz/charts.js',
                    //'js/dataviz/maps.js',
                    //'js/dataviz/datatables.js',
                    //'js/dataviz/dataviz.js',
                    'lib/moment/moment.js',
                    'lib/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
                    'lib/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
                    'lib/bootbox/bootbox.js',
                    'lib/ng-file-upload/ng-file-upload-shim.min.js',
                    'lib/ng-file-upload/ng-file-upload.min.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.datasources', {
        url: "/datasources",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/datasources.html',
            controller: 'DataSourcesCtrl'
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          }
        }
      })
      .state('admin.datasourceedit', {
        url: '/datasources/:id',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/codeeditor.html',
            controller: 'CodeEditorCtrl'
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            var fname = $stateParams.id, mode;
            if (fname.endsWith(".js")) mode = "javascript";
            if (fname.endsWith(".html")) mode = "html";

            return $ocLazyLoad.load([
              {
                  serie: true,
                  insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/codemirror/lib/codemirror.css',
                    'lib/codemirror/theme/ambiance.css',
                    'lib/codemirror/addon/hint/show-hint.css',
                    'lib/codemirror/addon/lint/lint.css',
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/codemirror/lib/codemirror.js',
                    'lib/codemirror/mode/'+mode+'/'+mode+'.js',
                    'lib/codemirror/addon/edit/matchbrackets.js',
                    'lib/codemirror/addon/edit/closebrackets.js',
                    'lib/codemirror/addon/selection/active-line.js',
                    'lib/codemirror/addon/comment/continuecomment.js',
                    'lib/codemirror/addon/hint/show-hint.js',
                    'lib/codemirror/addon/lint/lint.js',
                    'lib/codemirror/addon/hint/javascript-hint.js',
                    'lib/codemirror/addon/lint/javascript-lint.js',
                    'lib/jshint/dist/jshint.js',
                    'lib/AngularJS-Toaster/toaster.min.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.users', {
        url: '/users',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/users/users.html',
            controller: 'UsersCtrl',
            controllerAs: "users"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/bootbox/bootbox.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.adduser', {
        url: '/users/add',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/users/userEdit.html',
            controller: 'UsersEditCtrl',
            controllerAs: 'users'
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js'
                  ]
              }
            ]);
          }
        }
      }).state('admin.edituser', {
        url: '/users/edit/:id',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
            'content': {
            templateUrl: 'templates/users/userEdit.html',
            controller: 'UsersEditCtrl',
            controllerAs: 'users'
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.extractors', {
        url: '/extractors',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/extractors/extractors.html',
            controller: 'ExtractorCtrl',
            controllerAs: "extractors"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/bootbox/bootbox.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.editextractor', {
        url: '/extractors/edit/:id',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/extractors/extractorEdit.html',
            controller: 'ExtractorEditCtrl',
            controllerAs: "extractors"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/bootbox/bootbox.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.addextractor', {
        url: '/extractors/add',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/extractors/extractorEdit.html',
            controller: 'ExtractorEditCtrl',
            controllerAs: "extractors"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/bootbox/bootbox.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.roles', {
        url: '/roles',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/roles/roles.html',
            controller: 'RolesCtrl',
            controllerAs: "roles"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/bootbox/bootbox.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.addrole', {
        url: '/roles/add',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/roles/roleEdit.html',
            controller: 'RolesEditCtrl',
            controllerAs: "roles"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js'
                  ]
              }
            ]);
          }
        }
      }).state('admin.editrole', {
        url: '/roles/edit/:id',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/roles/roleEdit.html',
            controller: 'RolesEditCtrl',
            controllerAs: "roles"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.addendpoint', {
        url: '/endpoints/add',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/endpoints/endpointEdit.html',
            controller: 'EndpointEditCtrl',
            controllerAs: "endpoint"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    //'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/bootbox/bootbox.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.editendpoint', {
        url: '/endpoints/edit/:id',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/endpoints/endpointEdit.html',
            controller: 'EndpointEditCtrl',
            controllerAs: "endpoint"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    //'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/bootbox/bootbox.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.geolayers', {
        url: '/geolayers',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/geolayers/geolayers.html',
            controller: 'GeolayerCtrl',
            controllerAs: "geo"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    //'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/bootbox/bootbox.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.editgeolayer', {
        url: '/geolayers/edit/:id',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/geolayers/geolayerEdit.html',
            controller: 'GeolayerEditCtrl',
            controllerAs: "geo"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    //'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/bootbox/bootbox.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.addgeolayer', {
        url: '/geolayers/add',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/geolayers/geolayerEdit.html',
            controller: 'GeolayerEditCtrl',
            controllerAs: "geo"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    //'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/bootbox/bootbox.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.previewgeolayer', {
        url: '/geolayers/preview/:id',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/geolayers/geolayerPreview.html',
            controller: 'GeolayerPreviewCtrl',
            controllerAs: "geo"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                serie: true,
                //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                files: [
                  'lib/leaflet/dist/leaflet.css',
                  'lib/leaflet/dist/leaflet.js',
                  'lib/google-maps/lib/Google.min.js',
                  'js/dataviz/constants.js',
                  'js/dataviz/charts.js',
                  'js/dataviz/maps.js',
                  'js/dataviz/datatables.js',
                  'js/dataviz/dataviz.js',
                ]
              }
            ]);
          }
        }
      })
      .state('admin.apikeys', {
        url: '/apikeys',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/endpoints/apikeys.html',
            controller: 'ApiKeyCtrl',
            controllerAs: "apis"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/bootbox/bootbox.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.addapikey', {
        url: '/apikeys/add',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/endpoints/apikeyEdit.html',
            controller: 'ApiKeyEditCtrl',
            controllerAs: "apis"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/bootbox/bootbox.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.editapikey', {
        url: '/apikeys/edit/:id',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl'
          },
          'content': {
            templateUrl: 'templates/endpoints/apikeyEdit.html',
            controller: 'ApiKeyEditCtrl',
            controllerAs: "apis"
          }
        },
        resolve: {
          menuItems: function() {
            return adminMenuItems;
          },
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/bootbox/bootbox.js'
                  ]
              }
            ]);
          }
        }
      });

    $urlRouterProvider.otherwise("/dashboard/");

    var adminMenuItems = [
      {
        label: "Usuarios y permisos",
        menuItems: [
          {
            label:"Usuarios",
            stateLink: 'admin.users'
          },
          {
            label:"Roles",
            stateLink: 'admin.roles'
          }
        ]
      },
      {
        label: "Fuentes de datos",
        menuItems: [
          {
            label:"Extractores",
            stateLink: 'admin.extractors'
          },
          {
            label:"Capas",
            stateLink: 'admin.geolayers'
          },
          {
            label:"DataSources",
            stateLink: 'admin.datasources'
          },
          {
            label: "Dashboards",
            stateLink: "admin.dashboards"
          }
        ]
      },
      {
        label: "Catálogo de PM",
        stateLink: 'admin.pmcatalog'
      },
      {
        label: "API",
        link: "#",
        menuItems: [
          {
            label:"EndPoints",
            stateLink: "admin.endpoints"
          },
          {
            label:"API Keys",
            stateLink:"admin.apikeys"
          }
        ]
      },
      {
        label: "Bitácora",
        link: '#'
      },
    ];

    var dashboardMenuItems = [
      {
        label: "Visualizaciones",
        link: "#",
        menuItems: [
          {
            label: "Mapas",
            stateLink: 'dashboard.maps'
          },
          {
            label: "Gráficas dinámicas",
            stateLink: 'dashboard.charts'
          }
        ]
      },
      {
        label: "Estadísticas",
        link: "#",
        stateLink: 'dashboard.datatables'
      },
      {
        label: "Consultas",
        link: "#",
        menuItems: [
          {
            label:"Desagregada",
            link:"#"
          },
          {
            label:"Predefinida",
            link:"#"
          }
        ]
      },
      {
        label: "Indicadores",
        link: "#",
        menuItems: [
          {
            label:"Ambientales",
            link:"#"
          },
          {
            label:"Culturales",
            link:"#"
          },
          {
            label:"Demográficos",
            link:"#"
          }
        ]
      }
    ];
  };

  run.$inject = ["$rootScope", "$state", "$templateCache"];
  function run($rootScope, $state, $templateCache) {
    $rootScope.$state = $state;
  };

})();
