(function() {
    'use strict';

    angular
    .module('FST2015PM.directives')
    .directive('permission', Permission);

    Permission.$inject = ["$rootScope","$state"];
    function Permission($rootScope,$state) {
        return {
            restrict: 'AE',
            scope: {
                data: '=',
                permission: '='
            },
 
            link: function (scope, elem, attrs) {
                scope.$watch(scope.data , function() {
                    angular.forEach($rootScope.mapPages, function(page, index){
                        if (scope.permission != null ){
                            if(scope.permission.menuTab != null) {
                                if(scope.permission.menuTab == page.id){
                                    elem.hide();
                                } 
                            } else if(scope.permission.stateLink == page.id){
                                elem.hide();
                            }
                            return;
                        }                        
                    });
                });                
            }
        }
    };
    


})();