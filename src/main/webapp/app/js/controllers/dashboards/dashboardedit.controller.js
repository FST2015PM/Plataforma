(function() {
    'use strict';

    angular
        .module('FST2015PM.controllers')
        .controller('EditDashboardCtrl', EditDashboardCtrl);

    EditDashboardCtrl.$inject = ["$state","$stateParams", "$Datasource", "uuid", "$timeout", 'ENGINE_LEAFLET'];
    function EditDashboardCtrl($state, $stateParams, $Datasource, uuid, $timeout, ENGINE_LEAFLET) {
        var cnt = this;
        var renderers = [];
        cnt.widgets = [];
        cnt.formTitle = "Agregar tablero";
        cnt.dashboardData = {};
        cnt.gridsterOptions = {
            columns: 6,
            pushing: true,
            margins: [5, 5],
            mobileModeEnabled: true,
            defaultSizeX:2,
            defaultSizeY:2,
            minSizeX: 1,
            minSizeY: 1,
            resizable: {
                enabled: true,
                stop: function(event, $element, widget) {
                    var m;
                    renderers.forEach(function(item) {
                        if (widget.id === item.id) {
                            m = item;
                        }
                    });

                    if (m) {
                        if (m.type === "map") {
                            m.map.invalidateSize();
                        }
                        if (m.type==="gauge" || m.type==="chart") {
                            m.chart.reflow();
                        }
                    }

                    cnt.saveDashboard();
                }
            },
            draggable: {
                enabled: true,
                handle: '.panel-heading',
                handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
                stop: function(event, $element, widget) {
                    cnt.saveDashboard();
                }
            }
        };

        if($stateParams.id && $stateParams.id.length) {
            cnt.formTitle = "Editar tablero";
            $Datasource.getObject($stateParams.id, "Dashboard").then(function(ds) {
                cnt.dashboardData = ds.data;
                cnt.widgets = ds.data.widgets;

                $timeout(function() {
                    cnt.widgets.forEach(function(item) {
                        if (item.type === "map") {
                            var mp = dataviz.mapsFactory.createMap(item.id, ENGINE_LEAFLET, [40.46, -100.715], 3, true);

                            item.layers && item.layers.forEach(function(layer) {
                                $.getJSON(layer.resourceURL, function (geojson) {
                                    dataviz.mapsFactory.addGeoJSONLayer(mp, geojson, ENGINE_LEAFLET, false, true, layer.name);
                                });
                            });

                            renderers.push({id: item.id, type: "map", map: mp});
                        } else if (item.type === "indicator") {
                            $Datasource.aggregate(item.dataSourceName, item.groupField, item.showValue).then(function(ret){
                                if (ret.response && ret.response.data) {
                                    if (item.indicatorType === "label") {
                                        renderers.push({id: item.id, type:"label", chart: dataviz.chartsFactory.createLabel(item.id, parseFloat(ret.response.data[0].result).toFixed(2), item.unit || "")});
                                    } else if (item.indicatorType === "gauge") {
                                        renderers.push({id: item.id, type:"gauge", chart: dataviz.chartsFactory.createGauge(item.id, "", parseFloat(ret.response.data[0].result).toFixed(2), 0, 50000, item.unit || "")});
                                    }
                                }
                            });
                        } else if (item.type === "chart") {
                            var data = {};

                            if (!item.groupValues) {
                                $Datasource.listObjects(item.dataSourceName).then(function(res) {
                                    data = processChartData(res, item.groupField, item.valField, item.zField, item.chartType);
                                    data.title = item.name;
                                    data.xAxisTitle = item.xAxisTitle;
                                    data.yAxisTitle = item.yAxisTitle;

                                    if (item.chartType === "bar" || item.chartType === "column") {
                                        renderers.push({id: item.id, type:"chart", chart: dataviz.chartsFactory.createBarChart(item.id, data, item.chartType)});
                                    } else if (item.chartType === "line") {
                                        renderers.push({id: item.id, type:"chart", chart: dataviz.chartsFactory.createLineChart(item.id, data)});
                                    } else if (item.chartType === "scatter") {
                                        renderers.push({id: item.id, type:"chart", chart: dataviz.chartsFactory.createScatterChart(item.id, data)});
                                    } else if (item.chartType === "bubble") {
                                        renderers.push({id: item.id, type:"chart", chart: dataviz.chartsFactory.createBubbleChart(item.id, data)});
                                    }
                                });
                            } else {
                                $Datasource.aggregate(item.dataSourceName, item.valField, item.showValue, item.groupField, item.matchField, item.matchVal, item.sort).then(function(ret){
                                    data = processChartData(ret, item.groupField, item.valField, item.zField, item.chartType);
                                    data.title = item.name;
                                    data.xAxisTitle = item.xAxisTitle;
                                    data.yAxisTitle = item.yAxisTitle;

                                    if (item.chartType === "bar" || item.chartType === "column") {
                                        renderers.push({id: item.id, type:"chart", chart: dataviz.chartsFactory.createBarChart(item.id, data, item.chartType)});
                                    } else if (item.chartType === "line") {
                                        renderers.push({id: item.id, type:"chart", chart: dataviz.chartsFactory.createLineChart(item.id, data)});
                                    } else if (item.chartType === "scatter") {
                                        renderers.push({id: item.id, type:"chart", chart: dataviz.chartsFactory.createScatterChart(item.id, data)});
                                    } else if (item.chartType === "bubble") {
                                        renderers.push({id: item.id, type:"chart", chart: dataviz.chartsFactory.createBubbleChart(item.id, data)});
                                    }
                                });
                            }
                        }
                    });
                }, 500);
            });
        }

        cnt.addWidget = function(type) {
            var wid = uuid.v4().replace(/-/g, '');
            var minX = 2, minY = 2;

            if ("map" === type) {
                minX = minY = 3;
            }
            if ("indicator" === type) {
                minX = 1;
                minY = 2;
            }
            cnt.widgets.push({
                id: wid,
                name:type,
                type:type,
                minSizeY: minX,
                minSizeX: minY,
                sizeX: minX,
                sizeY: minY
            });

            cnt.saveDashboard();
        };

        cnt.removeWidget = function(widgetId) {
            cnt.widgets = cnt.widgets.filter(function(item) {
                return item.id !== widgetId;
            });

            cnt.saveDashboard();
        };

        cnt.configWidget = function(widget) {
            var state = "";
            if ("indicator" === widget.type) state = "admin.editindicatorwidget";
            if ("map" === widget.type) state = "admin.editmapdwidget";
            if ("chart" === widget.type) state = "admin.editchartwidget";
            if ("table" === widget.type) state = "admin.edittablewidget";
            $state.go(state, {id: $stateParams.id, wid: widget.id});
        };

        cnt.clear = function() {
            cnt.widgets = [];
        };

        cnt.saveDashboard = function(redirect) {
            cnt.dashboardData.widgets = cnt.widgets;
            if (!cnt.dashboardData._id) {
                $Datasource.addObject(cnt.dashboardData, "Dashboard")
                    .then(function(response) {
                        if (redirect) {
                            $state.go('admin.dashboards', {});
                        }
                    })
            } else {
                $Datasource.updateObject(cnt.dashboardData, "Dashboard")
                    .then(function(response) {
                        if (redirect) {
                            $state.go('admin.dashboards', {});
                        }
                    })
            }
        };
    }

    function processChartData(result, catField, valField, zField, chartType) {
        console.log(chartType);
        console.log(catField);
        console.log(valField);
        console.log(zField);
        console.log(result);
        var d=[], ret = {};

        ret.categories = [];
        ret.series = [];
        ret.series.push({values: []});

        if (result.response) { //Aggregation
            d = result.response.data || [];
        } else {
            d = result.data.data || [];
        }

        if (chartType === "scatter") {
            d.forEach(function(item) {
                var xy = [];
                xy[0] = item[catField];
                xy[1] = item[valField];
                ret.series[0].values.push(xy);
            });
        } else if (chartType === "bubble") {
            console.log("Must format bubble data");
            d.forEach(function(item) {
                var d = {};
                d.x = item[catField];
                d.y = item[valField];
                d.z = item[zField];
                ret.series[0].values.push(d);
            });
            console.log(ret);
        } else {
            d.forEach(function(item) {
                ret.categories.push(item[catField]);
                ret.series[0].values.push(item[valField]);
            });
        }

        return ret;
    }

})();
