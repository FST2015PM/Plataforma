(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ["$state"];
    function MainCtrl($state) {
      let cnt = this;

      cnt.isRootState = function() {
        return $state.current.name === "admin.main";
      };
    };

})();
