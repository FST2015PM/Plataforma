(function () {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('PMEditCatalog', PMEditCatalog);

  PMEditCatalog.$inject = ["$Datasource", "$stateParams", "$state"];
  function PMEditCatalog($Datasource, $stateParams, $state) {
    let cnt = this;
    cnt.formTitle = "Agregar Pueblo Mágico";
    cnt.pmData = {};
    cnt.stateList = [];
    cnt.muniList = [];
    cnt.locList = [];
    cnt.municipalities = [];
    cnt.localities = [];
    cnt.pictureData = {};
    cnt.validMime = true;
    cnt.canSend = true;
    cnt.processing = false;

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
        cnt.processing = true;
        
        if (cnt.validMime && cnt.pictureData && cnt.pictureData.base64) {
          cnt.pmData.picture = {
            fileName: cnt.pictureData.filename,
            type: cnt.pictureData.filetype,
            content: cnt.pictureData.base64
          };
        } else {
          if (cnt.pmData.picture) {
            delete cnt.pmData.picture;
          }
        }

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

    cnt.disableSend = function(e, fReader, file, rawFiles, fileObjects, fileObject) {
      cnt.canSend = false;
    };

    cnt.enableSend = function(e, fReader, file, rawFiles, fileObjects, fileObject) {
      cnt.canSend = true;
    };

    cnt.processPicture = function() {
      let mimes = "image/jpg|image/jpeg|image/png";
      cnt.validMime = cnt.pictureData.filetype.length && mimes.includes(cnt.pictureData.filetype);
      if (!cnt.validMime) cnt.pictureData = null;
    };

  };

})();
