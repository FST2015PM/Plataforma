(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('SideNavCtrl', SideNavCtrl);

    SideNavCtrl.$inject = ["$scope", "$rootScope", "$state", "$timeout", "$ACLService", "menuItems"];
    function SideNavCtrl($scope, $rootScope, $state, $timeout, $ACLService, menuItems) {
      let cnt = this;
      cnt.menuItems = menuItems || [];//$scope.userActions || [];
      $scope.$state = $state;
      cnt.loading = true;

      cnt.isExpanded = function(item) {
        var ret = false;
        if (item.stateLink && $state.includes(item.stateLink)) {
          ret = true;
        }

        if (!ret) {
          if (item.menuItems && item.menuItems.length > 0) {
            item.menuItems.forEach(function(subel) {
              if(subel.stateLink && $state.includes(subel.stateLink)) {
                ret = true;
              }
            });
          }
        }

        return ret;
      };

      $timeout(function() {
        $("#side-menu").metisMenu({preventDefault:false});
        cnt.loading = false;
      }, 200);

      cnt.click = function(item) {
        if (!item.menuItems && item.stateLink) {
          $state.go(item.stateLink);
        }
      };
    };

})();
