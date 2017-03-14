/*Adapted from https://github.com/diosney/angular-bootstrap-datetimepicker-directive*/
(function() {
  'use strict';

  angular
    .module('FST2015PM.directives')
    .directive('datetimepicker', DatetimePicker);

  DatetimePicker.$inject = ["$timeout", "datetimepicker"];
  function DatetimePicker($timeout, datetimepicker) {
    let default_options = datetimepicker.getOptions();

    return {
      require:'?ngModel',
      restrict: 'AE',
      scope: {
        datetimepickerOptions: '@'
      },
      link: function ($scope, $element, $attrs, ngModelCtrl) {
        let passed_in_options = $scope.$eval($attrs.datetimepickerOptions);
        let options = jQuery.extend({}, default_options, passed_in_options);

        $element.on('dp.change', e => {
          if (ngModelCtrl) {
            $timeout(() => {
              ngModelCtrl.$setViewValue(e.target.value);
            });
          }
        });
        $element.datetimepicker(options);

        function setPickerValue() {
          let date = options.defaultDate || null;

          if (ngModelCtrl && ngModelCtrl.$viewValue) {
            date = ngModelCtrl.$viewValue;
          }
          $element.data('DateTimePicker').date(date);
        }

        if (ngModelCtrl) {
          ngModelCtrl.$render = function() {
            setPickerValue();
          };
        }

        setPickerValue();
      }
    };
  };

})();
