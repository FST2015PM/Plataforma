(function() {
    'use strict';

    angular
        .module('FST2015PM.controllers')
        .controller('SideNavCtrl', SideNavCtrl);

    SideNavCtrl.$inject = ["$scope", "$rootScope", "$state", "$timeout", "$ACLService", "menuItems"];
    function SideNavCtrl($scope, $rootScope, $state, $timeout, $ACLService, menuItems) {
        var cnt = this;
        cnt.menuItems = menuItems || [];
        $scope.$state = $state;
        cnt.loading = true;

        cnt.isActive = function(item) {
            return item.stateLink && $state.includes(item.stateLink);
        };

        $timeout(function() {
            //$("#side-menu").metisMenu({preventDefault:false});
            cnt.loading = false;
        }, 200);

        cnt.click = function(item) {
            if (!item.menuItems && item.stateLink) {
                $state.go(item.stateLink);
            }
        };
    }

})();
