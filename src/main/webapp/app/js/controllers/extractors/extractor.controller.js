(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("ExtractorCtrl", ExtractorCtrl);

  ExtractorCtrl.$inject = ["$Datasource"];
  function ExtractorCtrl($Datasource) {
    let cnt = this;
    cnt.extractorList = [];

    $Datasource.listObjects("Extractor")
    .then(res => {
      if (res.data.data && res.data.data.length) {
        cnt.extractorList = res.data.data;
      }
    });

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

  }

})();
