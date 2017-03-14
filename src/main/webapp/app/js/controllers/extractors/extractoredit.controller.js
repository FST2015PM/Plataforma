(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("ExtractorEditCtrl", ExtractorEditCtrl);

  ExtractorEditCtrl.$inject = ["$Datasource", "$stateParams", "$state"];
  function ExtractorEditCtrl($Datasource, $stateParams, $state) {
    let cnt = this;
    cnt.formTitle = "Agregar extractor";
    cnt.extractorData = {};

    if($stateParams.id && $stateParams.id.length) {
      cnt.formTitle = "Editar extractor";
      $Datasource.getObject($stateParams.id, "Extractor").then(ds => {
        cnt.extractorData = ds.data;
      });
    }

    cnt.submitForm = function(form) {
      if (form.$valid) {
        if (!cnt.extractorData._id) {
          $Datasource.addObject(cnt.extractorData, "Extractor")
          .then(response => {
            $state.go('admin.extractors', {});
          })
        } else {
          $Datasource.updateObject(cnt.extractorData, "Extractor")
          .then(response => {
            $state.go('admin.extractors', {});
          })
        }
      }
    };

  }

})();
