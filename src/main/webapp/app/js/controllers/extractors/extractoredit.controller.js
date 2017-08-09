(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("ExtractorEditCtrl", ExtractorEditCtrl);

  ExtractorEditCtrl.$inject = ["$Datasource", "$stateParams", "$state", "$Extractor", "$http", "toaster"];
  function ExtractorEditCtrl($Datasource, $stateParams, $state, $Extractor, $http, toaster) {
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
      .then(function(res) {
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
      }).catch(function(err) {
        console.log(err);
      });
    } else {
      $Extractor.getEncodingList()
      .then(function(res) {
        cnt.charsetList = res.map(function(item) {
          var type = "Todos";
          if (item === "ISO-8859-1" || item === "UTF-8") type = "Más usados";
          return {
            type: type,
            name: item
          };
        });
      });

      $Datasource.listDatasources()
      .then(function(res) {
        if (res.data && res.data.length) {
          cnt.dsList = res.data;
          cnt.dsList = cnt.dsList.map(function(item) { return {id: item.name, name: item.name} });

          $Datasource.listObjects("Extractor").then(function(res) {
            if(res.data.data && res.data.data.length) {
              res.data.data.forEach(function(item) {
                if (item._id !== cnt.extractorData._id) {
                  let idx = cnt.dsList.map(function(item) { return item.name; }).indexOf(item.dataSource);
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
      $Datasource.getObject($stateParams.id, "Extractor").then(function(ds) {
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
          .then(function(response) {
            if (response.data.data && response.data.data._id) {
              $Extractor.loadExtractor(response.data.data._id);
            }
            toaster.pop({
              type: 'success',
              body: 'Se ha agregado el nuevo extractor',
              showCloseButton: true,
            });
            $state.go('admin.extractors', {});
          })
        } else {
          $Datasource.updateObject(cnt.extractorData, "Extractor")
          .then(function(response) {
            $Extractor.loadExtractor(cnt.extractorData._id);
            toaster.pop({
              type: 'success',
              body: 'Se ha actualizado el extractor',
              showCloseButton: true,
            });
            $state.go('admin.extractors', {});
          })
        }
      }
    };
  }

})();
