(function () {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('PMEditCatalog', PMEditCatalog);

  PMEditCatalog.$inject = ["$Datasource", "Upload", "$stateParams", "$state"];
  function PMEditCatalog($Datasource, Upload, $stateParams, $state) {
    let cnt = this;
    cnt.formTitle = "Agregar Pueblo Mágico";
    cnt.pmData = {};
    cnt.stateList = [];
    cnt.muniList = [];
    cnt.locList = [];
    cnt.municipalities = [];
    cnt.localities = [];

    $Datasource.listObjects("State")
    .then(response => {
      if (response.data.data && response.data.data.length) {
        cnt.stateList = response.data.data;
      }
    });

    if ($stateParams.id && $stateParams.id.length) {
      cnt.formTitle = "Editar Pueblo Mágico";
      $Datasource.getObject($stateParams.id, "MagicTown").then(mtown => {
        cnt.pmData = mtown.data;
        cnt.updateMuniList();
        cnt.updateLocList();
      });
    }

    cnt.updateMuniList = function(clear = false) {
      if (clear) {
        cnt.pmData.CVE_MUN = "";
        cnt.pmData.CVE_LOC = "";
      }
      cnt.muniList = [];
      if (cnt.pmData.CVE_ENT) {
        $Datasource.listObjects("Municipality", [{name:"CVE_ENT", value:cnt.pmData.CVE_ENT}]).then(res => {
          if (res.data.data && res.data.data.length) {
            cnt.muniList = res.data.data;
          }
        });
      }
    };

    cnt.updateLocList = function(clear = false) {
      if (clear) {
        cnt.pmData.CVE_LOC = "";
      }
      cnt.locList = [];
      if (cnt.pmData.CVE_MUN) {
        $Datasource.listObjects("Locality", [{name:"CVE_MUN", value:cnt.pmData.CVE_MUN}, {name:"CVE_ENT", value:cnt.pmData.CVE_ENT}]).then(res => {
          if (res.data.data && res.data.data.length) {
            cnt.locList = res.data.data;
          }
        });
      }
    };

    cnt.submitForm = function(form) {
      if (form.$valid) {
        if (cnt.pmData._id) {
          $Datasource.updateObject(cnt.pmData, "MagicTown")
          .then(response => {
            $state.go('admin.pmcatalog', {});
          });
        } else {
          $Datasource.addObject(cnt.pmData, "MagicTown")
          .then(response => {
            $state.go('admin.pmcatalog', {});
          });
        }
      }
    };

/*
  cnt.formPM = function (file) {
    if (file != null || file != undefined) {
      cnt.dbPM.file = file;
      file.upload = Upload.upload({
        url: 'fileupload',
        data: $scope.dbPM,
      });

      file.upload.then(function (response) {
        $timeout(function () {
          file.result = response.data;
        });
      }, function (response) {
        if (response.status > 0)
        cnt.errorMsg = response.status + ': ' + response.data;
      }, function (evt) {
        // Math.min is to fix IE which reports 200% sometimes
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    } else {
      if ($scope.show == 'add') {
        $PMCatalogService.savePM('/servicespm?action=add', $scope.dbPM).then(function () {

        });
      } else if ($scope.show == 'update') {
        $PMCatalogService.savePM('/servicespm?action=update', $scope.dbPM).then(function () {
          $scope.show = "all";
          $scope.listPM();
        });
      }
    }
  };

  $scope.configAdd = function () {
    $scope.dbPM = {nombre: "", descripcion: "", imagen: "", claveEstado: "", claveMunicipio: "", claveGeo: "", incorporado: false};
    $scope.show = "add";
    $scope.picFile = null;
  }

  $scope.configUpdate = function (_id) {
    $PMCatalogService.getById('/servicespm?action=detail&_id=' + _id).then(function (pm) {
      $scope.dbPM._id = pm._id;
      $scope.dbPM.nombre = pm.nombre;
      $scope.dbPM.descripcion = pm.descripcion;
      $scope.picFile = null;
      if (pm.imagen) {
        $scope.picFile = "/images/pm/" + pm._id.substring(pm._id.lastIndexOf(":") + 1) + "/" + pm.imagen;
      }
      $scope.dbPM.claveEstado = pm.claveEstado;
      $scope.dbPM.claveMunicipio = pm.claveMunicipio;
      $scope.dbPM.claveGeo = pm.claveGeo;
      $scope.dbPM.incorporado = pm.incorporado;
      $scope.show = "update";
    });
  }
  */
}

})();
