(function () {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('PMCatalog', PMCatalog);

  PMCatalog.$inject = ['$Datasource'];
  function PMCatalog($Datasource) {
    let cnt = this;
    cnt.pmList = [];

    $Datasource.listObjects("MagicTown")
    .then((response) => {
      if (response.data.data && response.data.data.length) {
        cnt.pmList = response.data.data;
        cnt.pmList.forEach(item => {
          if (item.PICTURE) {
            item.PICTURE = "../images/pm/"+item._id.substring(item._id.lastIndexOf(":") + 1) + "/" + item.PICTURE;
          } else {
            item.PICTURE = "../app/img/pmLogo.png";
          }
        });
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
