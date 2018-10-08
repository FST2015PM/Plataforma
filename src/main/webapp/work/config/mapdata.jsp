<!DOCTYPE html>
<html>
  <head>
    <title>App Data</title>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.3/dist/leaflet.css" integrity="sha512-07I2e+7D8p6he1SIM+1twR5TIrhUQn9+I6yjqD53JQjFiMf8EtC93ty0/5vJTZGF8aAocvHYNEDJajGdNx1IsQ==" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.0.3/dist/leaflet.js" integrity="sha512-A7vV8IFfih/D732iSSKi20u/ooOfj/AGehOKq0f4vLT1Zr2Y+RX7C+w8A1gaSasGtRUZpF/NZgzSAu4/Gc41Lg==" crossorigin=""></script>
    <style type="text/css">
      #mapContainer { height: 100%; }
    </style>
  </head>
  <body>
    <div class="container-fluid">
	    <div class="row">
	    		<div class="col-lg-12">
	    			<h2>Visualizaci&oacute;n de datos de la aplicaci&oacute;n m&oacute;vil</h2>
	    		</div>
	    </div>
      <div class="row">
        <div class="col-lg-12">
          <div id="mapContainer" style="height:500px; width:100%';"></div>
        </div>
      </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
    <script>
    		(function() {
    			var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>';
				var mbUrl ='https://api.mapbox.com/styles/v1/ismene93/ciwcwzju6000f2plkb4k1qk38/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaXNtZW5lOTMiLCJhIjoiY2l3Y3c3MXo4MDZlcjJvbTcybml5emRsYiJ9.P0J9VRG2kvpUhayggVa2fA';
				var mymap = L.map('mapContainer').setView([40.46, -100.715], 3);
					L.tileLayer(mbUrl, {
					attribution: mbAttr,
					maxZoom: 20,
				}).addTo(mymap);

				var layersControl = L.control.layers().addTo(mymap);

				//ver overlayControl = L.control.layers().addTo(mymap);
        var yellowIcon = new L.Icon({
					iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
					shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
					shadowSize: [41, 41]
				});

				var greenIcon = new L.Icon({
					iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
					shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
					shadowSize: [41, 41]
				});

				var blackIcon = new L.Icon({
					iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
					shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
					shadowSize: [41, 41]
				});

				var redIcon = new L.Icon({
					iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
					shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
					shadowSize: [41, 41]
				});

				$.get("https://miit.mx/api/v1/datasources/TourismSignal", function(res) {
					if (res.data) {
						var g = L.layerGroup();
						res.data.forEach(function(item) {
							var popupTemplate = "<h4>Se&ntilde;alamiento</h4><table class='table table-striped'><tbody><tr><td><b>Tipo</b></td><td>"+item.type+"</td></tr><tr><td><b>Posici&oacute;n</b></td><td>"+item.position+"</td></tr><tr><td><b>Visibilidad</b></td><td>"+item.visible+"</td></tr></tbody></table><img class='img-responsive' src='"+item.image+"'/>";
							var marker = L.marker([item.loc.coordinates.Lat, item.loc.coordinates.Long], {icon: greenIcon}).bindPopup(popupTemplate).addTo(g);
						});
						mymap.addLayer(g);
						layersControl.addOverlay(g, "Señalamientos");
					}

				});

        $.get("https://miit.mx/api/v1/datasources/Parking", function(res) {
					if (res.data) {
						var g = L.layerGroup();
						res.data.forEach(function(item) {
							var popupTemplate = "<h4>Estacionamiento</h4><table class='table table-striped'><tbody><tr><td><b>Nombre</b></td><td>"+item.name+"</td></tr><tr><td><b>Capacidad</b></td><td>"+item.carCapacity+"</td></tr><tr><td><b>Tarifa</b></td><td>"+item.fee+"</td></tr><tr><td><b>Tiempo libre</b></td><td>"+item.freeTime+"</td></tr><tr><td><b>Autoservicio</b></td><td>"+item.isSelfService+"</td></tr></tbody></table><img class='img-responsive' src='"+item.image+"'/>";
							var marker = L.marker([item.loc.coordinates.Lat, item.loc.coordinates.Long], {icon: yellowIcon}).bindPopup(popupTemplate).addTo(g);
						});
						mymap.addLayer(g);
						layersControl.addOverlay(g, "Estacionamientos");
					}

				});

				$.get("https://miit.mx/api/v1/datasources/Market", function(res) {
					if (res.data) {
						var g = L.layerGroup();
						res.data.forEach(function(item) {
						  var popupTemplate = "<h4>Mercado</h4><table class='table table-striped'><tbody><tr><td><b>Tipo</b></td><td>"+item.type+"</td></tr><tr><td><b>Nombre</b></td><td>"+item.name+"</td></tr><tr><td><b>Descripci&oacute;n</b></td><td>"+item.description+"</td></tr><tr><td><b>N&uacute;mero de comercios</b></td><td>"+item.shopNumber+"</td></tr></tbody></table><img class='img-responsive' src='"+item.image+"'/>";
						  var marker = L.marker([item.loc.coordinates.Lat, item.loc.coordinates.Long], {icon: redIcon}).bindPopup(popupTemplate).addTo(g);
						});
						mymap.addLayer(g);
						layersControl.addOverlay(g, "Mercados");
					}
				});

				$.get("https://miit.mx/api/v1/datasources/ATM", function(res) {
					if (res.data) {
						var g = L.layerGroup();
						res.data.forEach(function(item) {
							var popupTemplate = "<h4>Cajero</h4><table class='table table-striped'><tbody><tr><td><b>Banco</b></td><td>"+item.bank+"</td></tr><tr><td><b>Unidades</b></td><td>"+item.atmUnits+"</td></tr><tr><td><b>En servicio</b></td><td>"+(item.inService?"SI":"NO")+"</td></tr></tbody></table>";
							var marker = L.marker([item.loc.coordinates.Lat, item.loc.coordinates.Long], {icon: blackIcon}).bindPopup(popupTemplate).addTo(g);
						});
						mymap.addLayer(g);
						layersControl.addOverlay(g, "Cajeros");
					}
				});

				//mymap.fitBounds(cmarkers.getBounds());
    		})();
    </script>
  </body>
</html>
