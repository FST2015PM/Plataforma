(function() {
    'use strict';

    angular
        .module("FST2015PM.controllers")
        .controller("ExtractorCtrl", ExtractorCtrl);

    ExtractorCtrl.$inject = ["$Datasource", "$interval", "$Extractor", "$scope", "toaster"];
    function ExtractorCtrl($Datasource, $interval, $Extractor, $scope, toaster) {
        var cnt = this;
        var extractorsLoaded = false;
        cnt.interval = undefined;
        cnt.extractorList = [];

        $Datasource.listObjects("Extractor")
            .then(function(res) {
                if (res.data.data && res.data.data.length) {
                    cnt.extractorList = res.data.data.map(function(item) {
                        item.status = "DESCONOCIDO";

                        return item;
                    });
                    extractorsLoaded = true;

                    cnt.interval = $interval(function () {
                        if (extractorsLoaded) {
                            cnt.extractorList.forEach(function(item) {
                                $Extractor.getStatus(item._id)
                                    .then(function(res) {
                                        item.status = res;
                                    })
                                    .catch(function(error) {
                                        item.status = "DESCONOCIDO";
                                    });
                            });
                        }
                    }, 3000);
                }
            });

        cnt.startExtractor = function (extractor) {
            $Extractor.startExtractor(extractor._id);
            var msg = "Se ha iniciado el extractor "+extractor.name;
            toaster.pop({
                type: 'success',
                body: msg,
                showCloseButton: true
            });
        };

        cnt.canStart = function(extractor) {
            return !extractor.periodic && extractor.status && (extractor.status === "LOADED" || extractor.status === "STARTED");
        };

        cnt.deleteExtractor = function(id) {
            bootbox.confirm({
                message: "<h4>Este extractor será eliminado permanentemente. \n ¿Desea continuar?</h4>",
                buttons: {
                    cancel: {
                        label: "Cancelar"
                    },
                    confirm: {
                        label: "Aceptar"
                    }
                },
                callback: function(result) {
                    if (result) {
                        $Datasource.removeObject(id, "Extractor")
                            .then(function(res) {
                                cnt.extractorList.filter(function(elem, i) {
                                    if (elem._id === id) {
                                        cnt.extractorList.splice(i, 1);
                                    }
                                });
                            });
                        toaster.pop({
                            type: 'success',
                            body: 'Se ha eliminado el extractor',
                            showCloseButton: true
                        });
                    }
                }
            });
        };

        $scope.$on('$destroy', function() {
            if (angular.isDefined(cnt.interval)) {
                $interval.cancel(cnt.interval);
                cnt.interval = undefined;
            }
        });

    }

})();
