/*Adapted from https://github.com/diosney/angular-bootstrap-datetimepicker-directive*/
(function() {
    'use strict';

    angular
        .module('FST2015PM.directives')
        .directive('datetimepicker', DatetimePicker);

    DatetimePicker.$inject = ["$timeout", "datetimepicker"];
    function DatetimePicker($timeout, datetimepicker) {
        var default_options = datetimepicker.getOptions();

        return {
            require:'?ngModel',
            restrict: 'AE',
            scope: {
                datetimepickerOptions: '@'
            },
            link: function ($scope, $element, $attrs, ngModelCtrl) {
                var passed_in_options = $scope.$eval($attrs.datetimepickerOptions);
                var options = jQuery.extend({}, default_options, passed_in_options);

                $element.on('dp.change', function(e) {
                    if (ngModelCtrl) {
                        $timeout(function() {
                            ngModelCtrl.$setViewValue(e.target.value);
                        });
                    }
                });
                $element.datetimepicker(options);

                function setPickerValue() {
                    var date = options.defaultDate || null;

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
    }

})();
