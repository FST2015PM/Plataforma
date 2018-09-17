(function() {
    'use strict';

    angular
        .module("FST2015PM.controllers")
        .controller("EndpointCtrl", EndpointCtrl);

    EndpointCtrl.$inject = ["$Datasource", "toaster"];
    function EndpointCtrl($Datasource, toaster) {
        var cnt = this;
        cnt.dsList = [];

        $Datasource.listObjects("DSEndpoint")
            .then(function(res) {
                if (res.data.data && res.data.data.length) {
                    cnt.dsList = res.data.data;
                    cnt.dsList.forEach(function(item) {
                        if (item.restrictionType === "OPEN") {
                            item.restrictionTypeName = "NINGUNA";
                        } else if (item.restrictionType === "SESSION") {
                            item.restrictionTypeName = "SESIÓN ACTIVA";
                        } else if (item.restrictionType === "APIKEY") {
                            item.restrictionTypeName = "LLAVE API";
                        }
                    });
                }
            });

        cnt.deleteEndPoint = function(id) {
            bootbox.confirm({
                message: "<h4>Este punto de acceso será eliminado permanentemente.<br>¿Desea continuar?</h4>",
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
                        $Datasource.removeObject(id, "DSEndpoint")
                            .then(function(result) {
                                cnt.dsList.filter(function(elem, i) {
                                    if (elem._id === id) {
                                        cnt.dsList.splice(i, 1);
                                    }
                                });
                            });

                        toaster.pop({
                            type: 'success',
                            body: 'Se ha eliminado el punto de acceso',
                            showCloseButton: true,
                        });
                    }
                }
            });

        };

    }

})();
