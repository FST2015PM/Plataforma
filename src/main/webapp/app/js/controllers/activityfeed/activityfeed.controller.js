(function() {
    'use strict';

    angular
        .module("FST2015PM.controllers")
        .controller("ActivityFeedCtrl", ActivityFeedCtrl);

    ActivityFeedCtrl.$inject = ["$Datasource", 'API_VERSION', 'ENGINE_GOOGLEMAPS', 'ENGINE_LEAFLET', 'ENGINE_D3', 'ENGINE_LEAFLET_DUAL'];
    function ActivityFeedCtrl($Datasource) {
        var cnt = this;
        cnt.activityList = [];

        $Datasource.listObjects("PMLog")
            .then(function(res) {
                if (res.data.data && res.data.data.length) {
                    cnt.activityList = res.data.data;
                    cnt.activityList.forEach(function(item) {
                        switch(item.action) {
                            case 'ADD':
                                item.actionDescription = "ha agregado un elemento en";
                                break;
                            case 'EDIT':
                                item.actionDescription = "ha editado un elemento en";
                                break;
                            case 'DELETE':
                                item.actionDescription = "ha eliminado un elemento en";
                                break;
                            case 'EXTRACTORSTART':
                                item.actionDescription = "ha iniciado el extractor";
                                break;
                        }
                    });
                }
            });

    }

})();
