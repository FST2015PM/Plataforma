(function() {
  'use strict';

  angular
    .module('FST2015PM')
    .config(config)
    .run(run);

  config.$inject = ["$stateProvider", "$urlRouterProvider"];
  function config($stateProvider, $urlRouterProvider, $rootScope) {
    $stateProvider
      .state('pminfo', {
        url: "/pminfo/:id",
        templateUrl: 'templates/magictowns/pmInfo.html',
        controller: 'PMInformation',
        controllerAs: "pm"
      })
      .state('admin.endpoints', {
        url: '/endpoints',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl',
            controllerAs: 'nav'
          },
          'content': {
            templateUrl: 'templates/endpoints/endpoints.html',
            controller: 'EndpointCtrl',
            controllerAs: "endpoint"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
        templateUrl: "templates/container.html",
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }]
        }
      })
      .state('admin.dashboards', {
        url: '/dashboard',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/dashboards/dashboards.html',
            controller: 'DashboardCtrl',
            controllerAs: "dashboards"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/bootbox/bootbox.js',
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.editdashboard', {
        url: '/dashboard/edit/:id',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/dashboards/editDashboard.html',
            controller: 'EditDashboardCtrl',
            controllerAs: "ds"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/bootbox/bootbox.js',
                    'lib/angular-bootstrap/ui-bootstrap.min.js',
                    'lib/d3/d3.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/gridster/dist/jquery.gridster.min.js',
                    'lib/angular-gridster/dist/angular-gridster.min.css',
                    'lib/angular-gridster/dist/angular-gridster.min.js',
                    'lib/leaflet-markercluster/dist/MarkerCluster.css',
                    'lib/leaflet-markercluster/dist/MarkerCluster.Default.css',
                    'lib/leaflet/dist/leaflet.css',
                    'lib/leaflet/dist/leaflet.js',
                    'lib/leaflet-markercluster/dist/leaflet.markercluster.js',
                    'lib/spin.js/spin.min.js',
                    'lib/leaflet-spin/leaflet.spin.min.js',
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
      .state('admin.editmapdwidget', {
        url: '/dashboard/edit/:id/map/:wid',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/dashboards/mapWidgetEditForm.html',
            controller: 'MapEditWidgetCtrl',
            controllerAs: "widget"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/bootbox/bootbox.js',
                    'lib/angular-bootstrap/ui-bootstrap.min.js',
                    'lib/d3/d3.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/gridster/dist/jquery.gridster.min.js',
                    'lib/angular-gridster/dist/angular-gridster.min.css',
                    'lib/angular-gridster/dist/angular-gridster.min.js',
                    'lib/leaflet-markercluster/dist/MarkerCluster.css',
                    'lib/leaflet-markercluster/dist/MarkerCluster.Default.css',
                    'lib/leaflet/dist/leaflet.css',
                    'lib/leaflet/dist/leaflet.js',
                    'lib/leaflet-markercluster/dist/leaflet.markercluster.js',
                    'lib/spin.js/spin.min.js',
                    'lib/leaflet-spin/leaflet.spin.min.js',
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
      .state('admin.previewdashboard', {
        url: '/dashboard/preview/:id',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/dashboards/previewDashboard.html',
            controller: 'PreviewDashboardCtrl',
            controllerAs: "ds"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  files: [
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/bootbox/bootbox.js',
                    'lib/angular-bootstrap/ui-bootstrap.min.js',
                    'lib/d3/d3.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/gridster/dist/jquery.gridster.min.js',
                    'lib/angular-gridster/dist/angular-gridster.min.css',
                    'lib/angular-gridster/dist/angular-gridster.min.js',
                    'lib/leaflet-markercluster/dist/MarkerCluster.css',
                    'lib/leaflet-markercluster/dist/MarkerCluster.Default.css',
                    'lib/leaflet/dist/leaflet.css',
                    'lib/leaflet/dist/leaflet.js',
                    'lib/leaflet-markercluster/dist/leaflet.markercluster.js',
                    'lib/spin.js/spin.min.js',
                    'lib/leaflet-spin/leaflet.spin.min.js',
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/admin.html'
          }
        }
      })
      .state('admin.pmcatalog', {
        url: "/pm",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/magictowns/pmcatalog.html',
            controller: "PMCatalog",
            controllerAs: "mtown"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
                    'lib/matchheight/dist/jquery.matchHeight-min.js'
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/magictowns/pmEdit.html',
            controller: "PMEditCatalog",
            controllerAs: "mtown"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
                    'lib/bootbox/bootbox.js'
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/magictowns/pmEdit.html',
            controller: "PMEditCatalog",
            controllerAs: "mtown"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/datasources/datasources.html',
            controller: 'DSCtrl',
            controllerAs: "ds"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  //serie: true,
                  files: [
                    'lib/bootbox/bootbox.js'
                  ]
              }
            ]);
          }
        }
      })
      .state('admin.adddatasource', {
        url: "/datasources/add",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/datasources/datasourceEdit.html',
            controller: 'DSEditCtrl',
            controllerAs: "ds"
          }
        }, resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }]
        }
      })
      .state('admin.datasourceedit', {
        url: "/datasources/:id",
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/datasources/datasourceEdit.html',
            controller: 'DSEditCtrl',
            controllerAs: "ds"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }]
        }
      })
      .state('admin.previewdatasource', {
        url: '/datasources/preview/:id',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/datasources/datasourcePreview.html',
            controller: 'DSPreviewCtrl',
            controllerAs: "ds"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/spin.js/spin.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/datatables.net-bs/js/dataTables.bootstrap.min.js',
                    'js/dataviz/constants.js',
                    'js/dataviz/datatables.js',
                    'js/dataviz/dataviz.js',
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    'lib/bootbox/bootbox.js',
                    'lib/datatables.net-bs/css/dataTables.bootstrap.min.css',
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/users/users.html',
            controller: 'UsersCtrl',
            controllerAs: "users"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/users/userEdit.html',
            controller: 'UsersEditCtrl',
            controllerAs: 'users'
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
            controller: 'SideNavCtrl as nav'
          },
            'content': {
            templateUrl: 'templates/users/userEdit.html',
            controller: 'UsersEditCtrl',
            controllerAs: 'users'
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/extractors/extractors.html',
            controller: 'ExtractorCtrl',
            controllerAs: "extractors"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/extractors/extractorEdit.html',
            controller: 'ExtractorEditCtrl',
            controllerAs: "extractors"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
      .state('admin.previewextractor', {
        url: '/extractors/preview',
        params: {
          extractordef: null
        },
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/extractors/extractorPreview.html',
            controller: 'ExtractorEditCtrl',
            controllerAs: "extractors"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                  serie: true,
                  insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                  files: [
                    'lib/papaparse/papaparse.min.js',
                    'lib/datatables.net/js/jquery.dataTables.min.js',
                    'lib/datatables.net-bs/js/dataTables.bootstrap.min.js',
                    'js/dataviz/constants.js',
                    'js/dataviz/datatables.js',
                    'js/dataviz/dataviz.js',
                    'lib/AngularJS-Toaster/toaster.min.css',
                    'lib/AngularJS-Toaster/toaster.min.js',
                    'lib/bootbox/bootbox.js',
                    'lib/datatables.net-bs/css/dataTables.bootstrap.min.css',
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/extractors/extractorEdit.html',
            controller: 'ExtractorEditCtrl',
            controllerAs: "extractors"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/roles/roles.html',
            controller: 'RolesCtrl',
            controllerAs: "roles"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/roles/roleEdit.html',
            controller: 'RolesEditCtrl',
            controllerAs: "roles"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/roles/roleEdit.html',
            controller: 'RolesEditCtrl',
            controllerAs: "roles"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/endpoints/endpointEdit.html',
            controller: 'EndpointEditCtrl',
            controllerAs: "endpoint"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/endpoints/endpointEdit.html',
            controller: 'EndpointEditCtrl',
            controllerAs: "endpoint"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/geolayers/geolayers.html',
            controller: 'GeolayerCtrl',
            controllerAs: "geo"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/geolayers/geolayerEdit.html',
            controller: 'GeolayerEditCtrl',
            controllerAs: "geo"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/geolayers/geolayerEdit.html',
            controller: 'GeolayerEditCtrl',
            controllerAs: "geo"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/geolayers/geolayerPreview.html',
            controller: 'GeolayerPreviewCtrl',
            controllerAs: "geo"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
          loadDependencies: function($ocLazyLoad, $stateParams) {
            return $ocLazyLoad.load([
              {
                serie: true,
                //insertBefore: "#mainStyles", //Otherwise app styles will be overridem
                files: [
                  'lib/leaflet-markercluster/dist/MarkerCluster.css',
                  'lib/leaflet-markercluster/dist/MarkerCluster.Default.css',
                  'lib/leaflet/dist/leaflet.css',
                  'lib/leaflet/dist/leaflet.js',
                  'lib/leaflet-markercluster/dist/leaflet.markercluster.js',
                  'lib/spin.js/spin.min.js',
                  'lib/leaflet-spin/leaflet.spin.min.js',
                  'lib/google-maps/lib/Google.min.js',
                  'lib/togeojson/togeojson.js',
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/endpoints/apikeys.html',
            controller: 'ApiKeyCtrl',
            controllerAs: "apis"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/endpoints/apikeyEdit.html',
            controller: 'ApiKeyEditCtrl',
            controllerAs: "apis"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
            controller: 'SideNavCtrl as nav'
          },
          'content': {
            templateUrl: 'templates/endpoints/apikeyEdit.html',
            controller: 'ApiKeyEditCtrl',
            controllerAs: "apis"
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }],
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
      .state('admin.activity', {
        url: '/activity',
        views: {
          'sidenav': {
            templateUrl: 'templates/includes/sidenav.html',
            controller: 'SideNavCtrl',
            controllerAs: 'nav'
          },
          'content': {
            templateUrl: 'templates/activityfeed/activityFeed.html',
            controller: 'ActivityFeedCtrl as activity'
          }
        },
        resolve: {
          userInfo: ['$q', '$LoginService', function($q, $LoginService) {
            var deferred = $q.defer();
            $LoginService.me()
            .then(function(response) {
              deferred.resolve(response);
            }).catch(function(err) {
              deferred.reject({notLoggedIn: true});
            });
            return deferred.promise;
          }],
          menuItems: ['$ACLService', function($ACLService) {
            return $ACLService.getUserActions()
            .then(function(result) {
              return result.data || [];
            }).catch(function(err) {
              return [];
            });
          }]
        }
      });

    $urlRouterProvider.otherwise("/admin/");

  };

  run.$inject = ["$rootScope", "$state", "$stateParams", "$templateCache", "$http", "$window", "$LoginService"];
  function run($rootScope, $state, $stateParams, $templateCache, $http, $window, $LoginService) {
    let apiVersion = 1;

    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, eventObj) {
      if (eventObj.notLoggedIn) {
        $window.location.href = "/login";
      }
    });

    $LoginService.me()
    .then(function(response) {
      if (response.data) $rootScope.userInfo = response.data;
    }).catch(function(error) {
      $window.location.href = "/";
    });
  };
})();
