(function() {
  'use strict';

  angular
    .module('FST2015PM.controllers')
    .controller('CodeEditorCtrl', CodeEditorCtrl);

    CodeEditorCtrl.$inject = ['$scope', '$stateParams', '$ocLazyLoad', '$FileManager'];
    function CodeEditorCtrl($scope, $stateParams, $ocLazyLoad, $FileManager) {
      //console.log($stateParams);

      $scope.fileContent = 'Loading file content...';
      $scope.fileName = $stateParams.id;
      $scope.editorOptions = {
        lineNumbers: true,
        smartIndent: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        continueComments: true,
        gutters: ["CodeMirror-lint-markers"],
        lint: true,
        mode: 'javascript'
      };

      $FileManager.getFile($scope.fileName)
        .then((res) => {
          $scope.fileContent = res.data;
        });

      $scope.save = function() {
        $FileManager.saveFile($scope.fileName, $scope.fileContent)
        .then((res) => {
          if (res.status === 200) {
            $FileManager.getFile($scope.fileName)
              .then((res) => {
                $scope.fileContent = res.data;
              });
          }
        });
      }
    };

})();
