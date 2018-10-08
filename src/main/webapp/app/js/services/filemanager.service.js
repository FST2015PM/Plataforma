(function() {
    'use strict';

    angular
        .module('FST2015PM.services')
        .service('$FileManager', FileManager);

    FileManager.$inject = ['$http'];
    function FileManager($http) {
        var rootPath = "/app/js/datasources",
            gatewayPath = "/platform/jsp/fileManager.jsp",
            service = {};

        service.setConfig = setConfig;
        service.getFile = getFile;
        service.saveFile = saveFile;
        service.initFile = initFile;
        service.getFiles = getFiles;

        return service;

        function setConfig(conf) {
            rootPath = conf.rootPath || "/app/js/datasources";
            gatewayPath = conf.gatewayPath || "/platform/jsp/fileManager.jsp";
        }

        function getFile(filename) {
            if (filename === undefined) return;
            var theUrl = gatewayPath + "?file=" + filename;
            var request = $http({
                url: theUrl,
                method: "GET"
            });
            return request;
        }

        function saveFile(filename, filecontent) {
            if (filename === undefined) return;

            var fContent = filecontent,
                theUrl = gatewayPath + "?file=" + filename;

            //Remove last newline because codemirror adds one at the end of the text
            if (fContent.endsWith("\n") && fContent.lastIndexOf("\n") > 0)
                fContent = fContent.substring(0, fContent.lastIndexOf("\n"));

            fContent = fContent.replace(/\n/g, "\\n");

            var request = $http({
                url: theUrl,
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                data: fContent
            });

            return request;
        }

        function initFile(filename, override) {
            if (filename === undefined) return;
            var ow = override || false,
                theUrl = gatewayPath + "?file=" + filename + "&override=" + ow;

            var request = $http({
                url: theUrl,
                method: "PUT"
            });

            return request;
        }

        function getFiles() {
            var theUrl = gatewayPath,
                request = $http({
                    url: theUrl,
                    method: "GET"
                });

            return request;
        }

    }

})();
