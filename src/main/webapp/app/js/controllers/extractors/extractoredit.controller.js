(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("ExtractorEditCtrl", ExtractorEditCtrl);

  ExtractorEditCtrl.$inject = ["$Datasource", "$stateParams", "$state", "$Extractor", "$http"];
  function ExtractorEditCtrl($Datasource, $stateParams, $state, $Extractor, $http) {
    let cnt = this;
    cnt.formTitle = "Agregar extractor";
    cnt.extractorData = {};
    cnt.dsList = [];
    cnt.charsetList = [];
    cnt.processing = false;

    if ($stateParams.extractordef) {
      cnt.formTitle = "Previsualización";
      cnt.extractorData = $stateParams.extractordef;
      $Extractor.downloadPreview(cnt.extractorData.fileLocation, cnt.extractorData.zipped, cnt.extractorData.charset, cnt.extractorData.zipPath)
      .then((res) => {
        if (res.data && res.data.columns && res.data.data) {
          dataviz.dataTablesFactory.createDataTable("dataPreview", {
            scrollX: true,
            scrollY: "300px",
            scrollCollapse: true,
            ordering: false,
            searching: false,
            paging: false,
            processing: true,
            info: false,
            columns: res.data.columns,
            data:res.data.data
          });
        }
      }).catch((err) => {
        console.log(err);
      });
    } else {
      $Extractor.getEncodingList()
      .then(res => {
        cnt.charsetList = res;
      });

      $Datasource.listDatasources()
      .then(res => {
        if (res.data && res.data.length) {
          cnt.dsList = res.data;
          cnt.dsList.map(item => { return {id: item, name: item} });

          $Datasource.listObjects("Extractor").then(res => {
            if(res.data.data && res.data.data.length) {
              res.data.data.forEach(item => {
                if (item._id !== cnt.extractorData._id) {
                  let idx = cnt.dsList.map(item => { return item.name; }).indexOf(item.dataSource);
                  if (idx > -1) {
                    cnt.dsList.splice(idx, 1);
                  }
                }
              });
            }
          });
        }
      });
    }

    if($stateParams.id && $stateParams.id.length) {
      cnt.formTitle = "Editar extractor";
      $Datasource.getObject($stateParams.id, "Extractor").then(ds => {
        cnt.extractorData = ds.data;
      });
    }

    cnt.previewData = function(form, objData) {
      if (form.$valid) {
        $state.go('admin.previewextractor', {extractordef: objData});
      }
    };

    cnt.save = function(form) {
      let valid = true;
      if (form) valid = form.$valid;

      if (valid) {
        cnt.processing = true;
        if (!cnt.extractorData._id) {
          $Datasource.addObject(cnt.extractorData, "Extractor")
          .then(response => {
            if (response.data.data && response.data.data._id) {
              $Extractor.loadExtractor(response.data.data._id);
            }
            $state.go('admin.extractors', {});
          })
        } else {
          $Datasource.updateObject(cnt.extractorData, "Extractor")
          .then(response => {
            $Extractor.loadExtractor(cnt.extractorData._id);
            $state.go('admin.extractors', {});
          })
        }
      }
    };
  }

})();
