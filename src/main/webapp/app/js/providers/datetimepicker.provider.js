(function() {
  'use strict';

  angular
    .module('FST2015PM.services')
    .provider('datetimepicker', DtPicker);

  DtPicker.$inject = [];
  function DtPicker() {
    let default_options = {};

    this.setOptions = function (options) {
      default_options = options;
    };

    this.$get = function () {
      return {
        getOptions: function () {
          return default_options;
        }
      };
    };
  };

})();
