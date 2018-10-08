/** Class to encapsulate maps creation */
function MapsFactory() {
    //Create PM watermark on map
    L.Control.Watermark = L.Control.extend({
        onAdd: function(map) {
            var img = L.DomUtil.create('img');
            img.src = '/android-chrome-512x512.png';
            img.style.width = '50px';
            return img;
        },
        onRemove: function(map) { }
    });

    L.control.watermark = function(opts) {
        return new L.Control.Watermark(opts);
    };

    this.watermark = L.control.watermark({ position: 'bottomleft' });

    function getColor(d) {
        return d > 1000 ? '#800026' :
            d > 500  ? '#BD0026' :
                d > 200  ? '#E31A1C' :
                    d > 100  ? '#FC4E2A' :
                        d > 50   ? '#FD8D3C' :
                            d > 20   ? '#FEB24C' :
                                d > 10   ? '#FED976' :
                                    '#FFEDA0';
    }

    function _onEachFeature(feature, layer) {
        // en caso de que solo se muestres un popup indicados en el Json
        if (feature.properties.popupContent) {
            layer.bindPopup(feature.properties.popupContent);
        }
    }

    function _onEachFeatureAll(feature, layer) {
        //mostrar todas las propiedades
        var totProp, data, value ;
        totProp = "<table style = \"border: 1px solid black;\"><tr> <th style=\"width:50%\">Caracter&iacute;stica</th> <th style=\"width:50%\">Valor</th></tr>";
        for (data in feature.properties) {
            value = String(feature.properties[data]);
            totProp += "<tr><td>"+ data + "</td><td>" + value +"</td></tr>" ;
        }
        totProp += "</table";
        if (feature.properties) {
            layer.bindPopup( totProp);
        }
    }

    function _onEachStyleFromJson(feature) {
        if(feature.properties.color) {
            return {
                color:feature.properties.color,
                weight: 5,
                opacity: 0.65
            };
        }
    }


    this.createMap = function(container, engine, firstPoint, setZoom, overlayed, measureControlEnabled, callbackGoogle) {
        var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>';
        var mbUrl ='https://api.mapbox.com/styles/v1/ismene93/ciwcwzju6000f2plkb4k1qk38/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaXNtZW5lOTMiLCJhIjoiY2l3Y3c3MXo4MDZlcjJvbTcybml5emRsYiJ9.P0J9VRG2kvpUhayggVa2fA';
        switch(engine){
            case ENGINE_LEAFLET:
                if (!L) return;
                var mapLeft = L.map(container).setView([firstPoint[0], firstPoint[1]], setZoom);

                L.tileLayer(mbUrl, {
                    attribution: mbAttr,
                    maxZoom: 20,
                }).addTo(mapLeft);

                this.watermark && mapLeft.addControl(this.watermark);
                if (overlayed && mapLeft.layers && mapLeft.layers.length) {
                    mapLeft.overLayControl = L.control.layers().addTo(mapLeft);
                }

                if (measureControlEnabled) {
                    mapLeft.measureControl = L.control.measure({ primaryLengthUnit: 'kilometers', primaryAreaUnit: 'kilometers', localization: 'es' }).addTo(mapLeft);
                }

                return mapLeft;
                break;
            case ENGINE_LEAFLET_DUAL:
                if (!L) return;
                var mbUrl2='https://api.mapbox.com/styles/v1/ismene93/ciwd28yeq000h2pnafgwqprhz/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaXNtZW5lOTMiLCJhIjoiY2l3Y3c3MXo4MDZlcjJvbTcybml5emRsYiJ9.P0J9VRG2kvpUhayggVa2fA';

                var grayscale = L.tileLayer(mbUrl2, {id: 'mapbox.light', attribution: mbAttr}),
                    streets = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr});

                var ret = L.map(container,{
                    center: [firstPoint[0], firstPoint[1]],
                    zoom: setZoom,
                    layers: [grayscale, streets]
                });

                this.watermark && ret.addControl(this.watermark);

                var baseLayers = {
                    "Grayscale": grayscale,
                    "Streets": streets
                };
                L.control.layers(baseLayers).addTo(ret);
                return ret;
                break;
            case ENGINE_GOOGLEMAPS:

                GoogleMapsLoader.KEY = 'AIzaSyC2hy80dZpGaH4_ivGjqYS1f_UDJZrgyBI';

                GoogleMapsLoader.load(function(google) {
                    var map = new google.maps.Map(container, {
                        center: {lat: firstPoint[0], lng: firstPoint[1]},
                        scrollwheel: true,
                        zoom: setZoom
                    });
                    callbackGoogle(map);
                });
                break;
        }
    };

    function addStyle(feature) {
        return {
            fillColor: getColor(feature.properties.pob),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    this.addGeoJSONLayerCVS = function(map, data){
        var geoLayer = L.geoCsv(data, {style: this.addStyle });
        map.addLayer(geoLayer);
        return geoLayer;
    };

    this.addKMLLayer = function(map, kml, engine, clustered, asOverlay, title) {
        //TODO: Initialize clustered and asOverlay to false
        var parser = new DOMParser();
        var dom = parser.parseFromString(kml, "text/xml");

        this.addGeoJSONLayer(map, toGeoJSON.kml(dom), engine, clustered, asOverlay, title);
    };

    this.addGeoJSONLayer = function(map, data, engine, clustered, asOverlay, title) {
        //TODO: Initialize clustered and asOverlay to false
        switch(engine) {
            case ENGINE_GOOGLEMAPS:
                if (map) {
                    map.data.loadGeoJson(data);
                }
                break;
            case ENGINE_LEAFLET:
                var dataOnMap = L.geoJSON(data, {
                    onEachFeature: this._onEachFeatureAll,
                    style: this._onEachStyle
                });

                if (!clustered) {
                    map.addLayer(dataOnMap);
                    if (asOverlay) {
                        map.overLayControl && map.overLayControl.addOverlay(dataOnMap, title);
                    }
                    map.fitBounds(dataOnMap.getBounds());
                } else {
                    var cmarkers = L.markerClusterGroup({
                        showCoverageOnHover: false
                    });
                    cmarkers.addLayer(dataOnMap);
                    map.addLayer(cmarkers);
                    map.fitBounds(cmarkers.getBounds());
                }
                //.addTo(map);
                return dataOnMap;
                break;
            case ENGINE_D3:
                break;
            default:
        }
    };

    this.addControls = function(map, pos, idInForm, nameButt){
        var command = L.control({position: pos});
        command.onAdd = function(map){
            var div = L.DomUtil.create('div', 'btn  btn-default checkbox');
            div.innerHTML = '<div><form> <input id="'+idInForm+'" type="checkbox"/>'+nameButt+'</form></div>';
            return div;
        };
        command.addTo(map);
    };


    function addRoute(map, origin, destination, type, engine) {
        switch(engine) {
            case ENGINE_GOOGLEMAPS:
                if (map) {
                    GoogleMapsLoader.load(function(google, map, origin, destination, type) {
                        var directionsDisplay = new google.maps.DirectionsRenderer({
                            map: map
                        });
                        //formar el request con la ruta
                        var request = {
                            destination: destination,
                            origin: origin,
                            travelMode: type
                        };
                        //ejecutar la direccion del servicio
                        var directionsService = new google.maps.DirectionsService();
                        directionsService.route(request, function(response, status) {
                            if (status == 'OK') {
                                //si se realizo correctamente la consulta se establece la dirección
                                directionsDisplay.setDirections(response);
                            }
                        });
                    });
                }

                break;
            case ENGINE_LEAFLET:

                break;
            case ENGINE_D3:
                break;
            default:
        }//switch
    }//route

    this.addSimpleMarker = function(data, map) {
        return L.marker([data[0], data[1]]).addTo(map);
    };

    function addCircleMarker(map, data){
        var geojsonMarkerOptionsBlue = {
            radius: 8,
            fillColor: "#5882FA",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        var geojsonMarkerOptionsGreen = {
            radius: 8,
            fillColor: "#04B431",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                if (feature.properties.popupContent)
                    return L.circleMarker(latlng, geojsonMarkerOptionsBlue)
                else
                    return L.circleMarker(latlng, geojsonMarkerOptionsGreen)
            }
        }).addTo(map);
    }

    this.addMarker = function(map, data, engine) {
        switch(engine) {
            case ENGINE_GOOGLEMAPS:
                if (map) {
                    GoogleMapsLoader.load(function(google, map, data, title) {
                        var marker2 = new google.maps.Marker({
                            map: map,
                            position: market,
                            title: title
                        });
                    });
                };
                break;
            case ENGINE_LEAFLET:
                var greenIcon = L.icon({
                    iconUrl: './img/icon/leaf-green.png',
                    shadowUrl: './img/icon/leaf-shadow.png',
                    iconSize:     [38, 95], // size of the icon
                    shadowSize:   [50, 64], // size of the shadow
                    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                    shadowAnchor: [4, 62],  // the same for the shadow
                    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                });
                var escuela = L.icon({
                    iconUrl: './img/icon/bandera.png',
                    iconSize:     [38, 80], // size of the icon
                    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                });
                var templo = L.icon({
                    iconUrl: './img/icon/blanco.png',
                    iconSize:     [38, 70], // size of the icon
                    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                });
                L.geoJSON(data, {
                    pointToLayer: function (feature, latlng) {
                        switch(feature.properties.geografico){
                            case "Escuela":
                                return L.marker(latlng, {icon: escuela});
                                break;
                            case "Templo":
                                return L.marker(latlng, {icon: templo});
                                break;
                            default:
                                return L.marker(latlng, {icon: greenIcon});
                                break;
                        }
                    }
                }).addTo(map);
                break;
            case ENGINE_D3:
                break;
            default:
                break;
        }
        return;
    };
}
