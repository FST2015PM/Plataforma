(function() {
  'use strict'

  angular
    .module("FST2015PM.controllers")
    .controller("DSEditCtrl", DSEditCtrl);

  DSEditCtrl.$inject = ["$Datasource", "$stateParams", "$state"];
  function DSEditCtrl($Datasource, $stateParams, $state) {
    let cnt = this;
    cnt.formTitle = "Agregar Conjunto";
    cnt.dsList = [];
    cnt.dsData = {};
    cnt.dsEntry = {};
    cnt.dSourceName;
    cnt.nameValid = true;
    cnt.processing = false;

    if($stateParams.id && $stateParams.id.length) {
      cnt.formTitle = "Editar Conjunto";
      $Datasource.getObject($stateParams.id, "DBDataSource").then(ds => {
        cnt.dsData = ds.data;
        cnt.dSourceName = ds.data.name;
      });
    }

    cnt.submitForm = function(form) {
      if (form.$valid && cnt.nameValid) {
        cnt.dsData.name = cnt.dSourceName;

        cnt.processing = true;
        if (!cnt.dsData._id) {
          $Datasource.addObject(cnt.dsData, "DBDataSource")
          .then(response => {
            $Datasource.updateDBSources();
            $state.go('admin.datasources', {});
          })
        } else {
          $Datasource.updateObject(cnt.dsData, "DBDataSource")
          .then(response => {
            $Datasource.updateDBSources();
            $state.go('admin.datasources', {});
          })
        }
      }
    };

    cnt.removeEntry = function(entryName) {
      if (!entryName) return;

      cnt.dsData.columns = cnt.dsData.columns.filter((item) => {
        return item.name !== entryName;
      });
    }

    cnt.isNameValid = function() {
      $Datasource.listObjects("DBDataSource")
      .then(res => {
        if (res.data.data && res.data.data.length) {
          //TODO: Move restricted datasources to configuration

          let e = res.data.data || [];
          e.push({name: "User"});
          e.push({name: "Role"});
          e.push({name: "UserSession"});
          e.push({name: "ResetPasswordToken"});
          e.push({name: "APIKey"});

          e = e.filter((item) => {
            return item.name === cnt.dSourceName;
          });

          if (e && e.length) {
            if (e[0].name === cnt.dsData.name) {
              e = [];
            }
          }
          cnt.nameValid = (e.length === 0);
        }
      });
    };

    cnt.addField = function() {
      let add = false;
      if (cnt.dsEntry) {
        if (cnt.dsEntry.name && cnt.dsEntry.name.length &&
          cnt.dsEntry.title && cnt.dsEntry.title.length &&
          cnt.dsEntry.type && cnt.dsEntry.type.length) {
            add = true;
          }

          if (add && cnt.dsData.columns) {
            let e = cnt.dsData.columns.filter((item) => {
              return cnt.dsEntry.name === item.name;
            });

            if (e.length) add = false;
          }
      }

      if (!add) return;

      let cl = cloneEntry(cnt.dsEntry);
      if (cnt.dsData.columns && cnt.dsData.columns.length) {
        cnt.dsData.columns.push(cl);
      } else {
        cnt.dsData.columns = [];
        cnt.dsData.columns.push(cl);
      }
      cnt.dsEntry = {}
    };

    function cloneEntry(entry) {
      if (!entry) return;
      let ret = {};

      if (typeof entry === "object") {
        for (let p in entry) {
          if (entry.hasOwnProperty(p)) {
            if (typeof entry[p] === "object") {
              ret[p] = cloneEntry(entry[p]);
            } else {
              ret[p] = entry[p];
            }
          }
        }
        return ret;
      }

      return entry;
    };

  };

})();
