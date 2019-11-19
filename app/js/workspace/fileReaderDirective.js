'use strict';
define([],
  function() {
    var dependencies = [];

    var FileReaderDirective = function() {
      return {
        scope: {
          model: '='
        },
        restrict: 'E',
        template: '<input id="workspace-upload-input" type="file" accept=".json">',
        link: function(scope, element) {
          function onLoadContents(env) {
            scope.$apply(function() {
              scope.model.contents = env.target.result;
            });
          }

          element.on('change', function(event) {
            scope.$apply(function(scope) {
              scope.model.file = event.target.files[0];
              if (!scope.model.file) {
                delete scope.model.contents;
                return;
              }

              var reader = new FileReader();
              reader.onload = onLoadContents;
              reader.readAsText(scope.model.file);
            });
          });
        }
      };
    };
    return dependencies.concat(FileReaderDirective);
  });