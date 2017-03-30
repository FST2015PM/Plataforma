(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("ExtractorCtrl", ExtractorCtrl);

  ExtractorCtrl.$inject = ["$Datasource", "$interval", "$Extractor", "$scope"];
  function ExtractorCtrl($Datasource, $interval, $Extractor, $scope) {
    let cnt = this,
        interval = undefined,
        extractorsLoaded = false;
    cnt.extractorList = [];

    $Datasource.listObjects("Extractor")
    .then(res => {
      if (res.data.data && res.data.data.length) {
        cnt.extractorList = res.data.data.map(item => {
          item.status = "DESCONOCIDO";

          return item;
        });
        extractorsLoaded = true;

        interval = $interval(function () {
          if (extractorsLoaded) {
            cnt.extractorList.forEach(item => {
              $Extractor.getStatus(item._id)
              .then(res => {
                item.status = res;
              })
              .catch(error => {
                item.status = "DESCONOCIDO";
              });
            });
          }
        }, 3000);
      }
    });

    cnt.startExtractor = function (extractor) {
      $Extractor.startExtractor(extractor._id);
    };

    cnt.canStart = function(extractor) {
      return !extractor.periodic && extractor.status && (extractor.status === "LOADED" || extractor.status === "STARTED");
    };

    cnt.deleteExtractor = function(id) {
      bootbox.confirm("<h3>Este extractor será eliminado permanentemente. \n ¿Deseas continuar?</h3>", result => {
        if (result) {
          $Datasource.removeObject(id, "Extractor")
          .then(result => {
            cnt.extractorList.filter((elem, i) => {
              if (elem._id === id) {
                cnt.extractorList.splice(i, 1);
              }
            });
          });
        }
      });
    };

    $scope.$on('$destroy', () => {
      if (angular.isDefined(interval)) {
        $interval.cancel(interval);
        interval = undefined;
      }
    });

  }

})();
