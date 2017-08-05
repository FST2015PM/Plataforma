[![Build Status](https://jenkins.hasdaipacheco.com/buildStatus/icon?job=Plataforma-QA)](https://jenkins.hasdaipacheco.com/job/Plataforma-QA/)
[![Quality Gate](https://sonarqube.hasdaipacheco.com/api/badges/gate?key=org.fst2015pm.swbforms:master)](https://sonarqube.hasdaipacheco.com/dashboard/index/org.fst2015pm.swbforms:master)


## Descripción

La **Plataforma de Integración de Información Heterogénea Asociada a Destinos Turísticos** provee mecanismos para acelerar la captura e integración de información de fuentes diversas, asociadas al sector turístico, mediante su estructuración y explotación para apoyar en la caracterización y análisis de los destinos.

Para lograr lo anterior, la plataforma proporciona componentes para la extracción e integración de datos en formatos abiertos estructurados (JSON, CSV, DBF, KML, SHP, GEOJSON), con la finalidad de generar colecciones de datos que sean visualizables a través de gráficos y mapas con información geolocalizada. La información contenida en la plataforma puede ser también expuesta en formato JSON mediante un endpoint de servicios REST para permitir la integración de aplicaciones externas.

## Capturas de pantalla
### Login
<img src="https://github.com/FST2015PM/documentacion/raw/gh-pages/images/app-preview/screenshot1.png" />

### Conjuntos de datos
<img src="https://github.com/FST2015PM/documentacion/raw/gh-pages/images/app-preview/screenshot2.png" />

### Ficha de pueblo mágico
<img src="https://github.com/FST2015PM/documentacion/raw/gh-pages/images/app-preview/screenshot3.png" />

### Tableros de análisis
<img src="https://github.com/FST2015PM/documentacion/raw/gh-pages/images/app-preview/screenshot4.png" />

### Gestión de puntos de acceso
<img src="https://github.com/FST2015PM/documentacion/raw/gh-pages/images/app-preview/screenshot5.png" />

### Gestión de capas geográficas
<img src="https://github.com/FST2015PM/documentacion/raw/gh-pages/images/app-preview/screenshot6.png" />

### Previsualización de capas
<img src="https://github.com/FST2015PM/documentacion/raw/gh-pages/images/app-preview/screenshot7.png" />

## Instalación
### Pre-requisitos

* MongoDB
* Oracle JDK 1.8 o mayor
* Apache maven
* Nodejs
* Bower

### Quick start
Se requiere un servidor de MongoDB.

#### Clonar el repositorio
````sh
git clone https://github.com/FST2015PM/Plataforma.git
cd Plataforma
````

#### Construir y empaquetar la aplicación
````sh
mvn clean && mvn package
````

#### Desplegar la aplicación usando webapp-runner (sólo desarrollo)

````sh
java -jar target/dependency/webapp-runner.jar target/Plataforma-1.0-SNAPSHOT.war
````
#### Desplegar la aplicación en ambientes productivos

Deberá establecer la variable de entorno **FST2015PM_ENV** con el valor _production_, de lo contrario, los enlaces a los recursos podrían no funcionar.

#### Acceder a la aplicación
En su navegador Web vaya a [localhost:8080](localhost:8080) para iniciar sesión.
