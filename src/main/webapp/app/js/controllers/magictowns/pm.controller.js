(function () {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('PMCatalog', PMCatalog);

  PMCatalog.$inject = ['$Datasource', '$timeout', 'toaster'];
  function PMCatalog($Datasource, $timeout, toaster) {
    var cnt = this;
    cnt.pmList = [];

    angular.element(document).ready(function () {
      $timeout(function() {
        $(".sameheight").matchHeight();
      }, 2000);
    });

    $Datasource.listObjects("MagicTown")
    .then(function(response) {
      if (response.data.data && response.data.data.length) {
        cnt.pmList = response.data.data;
      }
    });

    cnt.deletePM = function (_id) {
      bootbox.confirm({
        message: "<h4>Este Pueblo Mágico será eliminado permanentemente.<br>¿Desea continuar?</h4>",
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
            $Datasource.removeObject(_id, "MagicTown")
            .then(function(result) {
              cnt.pmList.filter(function(elem, i) {
                if (elem._id === _id) {
                  cnt.pmList.splice(i, 1);
                }
              });
            });

            toaster.pop({
              type: 'success',
              body: 'Se ha eliminado el Pueblo Mágico',
              showCloseButton: true
            });
          }
        }
      });

    };

  }

})();
