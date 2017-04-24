(function () {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('PMCatalog', PMCatalog);

  PMCatalog.$inject = ['$Datasource', '$timeout'];
  function PMCatalog($Datasource, $timeout) {
    let cnt = this;
    cnt.pmList = [];

    angular.element(document).ready(function () {
      $timeout(() => {
        $(".sameheight").matchHeight();
      }, 2000);
    });

    $Datasource.listObjects("MagicTown")
    .then((response) => {
      if (response.data.data && response.data.data.length) {
        cnt.pmList = response.data.data;
      }
    });

    cnt.deletePM = function (_id) {
      bootbox.confirm("<h3>Este pueblo mágico será eliminado permanentemente. \n ¿Deseas continuar?</h3>", result => {
        if (result) {
          $Datasource.removeObject(_id, "MagicTown")
          .then(result => {
            cnt.pmList.filter((elem, i) => {
              if (elem._id === _id) {
                cnt.pmList.splice(i, 1);
              }
            });
          });
        }
      });
    };

  }

})();
