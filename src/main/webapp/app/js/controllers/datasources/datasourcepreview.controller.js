(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("DSPreviewCtrl", DSPreviewCtrl);

    DSPreviewCtrl.$inject = ["$Datasource", "$stateParams", "$timeout", "$scope"];
    function DSPreviewCtrl($Datasource, $stateParams, $timeout, $scope) {
      let cnt = this;
      let columns = [];
      let dTable;
      cnt.dsName = $stateParams.id || "";

      if($stateParams.id && $stateParams.id.length) {
        let spinner = new Spinner({
          top: '50%',
          left: '50%'
        }).spin(document.getElementById("tableContainer"));

        $Datasource.listObjects($stateParams.id).then(ds => {
          if (ds.data && ds.data.data) {
            ds.data.data.forEach(item => {
              delete item._id;
            });

            let sample = ds.data.data[0];

            if (sample) {
              for (let p in sample) {
                if (sample.hasOwnProperty(p)) {
                  columns.push({name: p, data: p, title: p, defaultContent:" "});
                }
              }
            }
          }

          if (columns.length > 0) {
            dTable = dataviz.dataTablesFactory.createDataTable("previewData", {
              scrollX: true,
              scrollY: "300px",
              scrollCollapse: true,
              ordering: false,
              //searching: false,
              //paging: false,
              processing: true,
              deferRender: true,
              info: false,
              columns: columns,
              data:ds.data.data,
              initComplete: function() {
                spinner.stop();
              }
            });
          } else {
            document.getElementById("tableContainer").innerHTML = "<p>No existen datos en este conjunto</p>";
            spinner.stop();
          }

          //cnt.extractorData = ds.data;
        });
      }

      $scope.$on('$destroy', () => {
        if (angular.isDefined(dTable)) {
          dTable.destroy(true);
        }
      });

    };

})()
