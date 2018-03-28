'use strict';
define([], function() {
  var dependencies = [
    '$stateParams',
    '$modal',
    'ToggleColumnsResource',
    'mcdaRootPath'
  ];
  var toggleColumnsDirective = function(
    $stateParams,
    $modal,
    ToggleColumnsResource,
    mcdaRootPath) {
    return {
      restrict: 'E',
      scope: {
        'toggledColumns': '=',
        'editMode': '='
      },
      templateUrl: mcdaRootPath + 'js/effectsTable/toggleColumnsDirective.html',
      link: function(scope) {
        // functions
        scope.toggleColumns = toggleColumns;

        // init
        ToggleColumnsResource.get($stateParams).$promise.then(function(response) {
          var toggledColumns = response.toggledColumns;
          if (toggledColumns) {
            scope.toggledColumns = toggledColumns;
          } else {
            scope.toggledColumns = {
              criteria: true,
              description: true,
              units: true,
              references: true,
              strength: true
            };
          }
        });

        function toggleColumns() {
          $modal.open({
            templateUrl: mcdaRootPath + 'js/effectsTable/toggleColumns.html',
            controller: 'ToggleColumnsController',
            resolve: {
              toggledColumns: function() {
                return scope.toggledColumns;
              },
              callback: function() {
                return function(newToggledColumns) {
                  scope.toggledColumns = newToggledColumns;
                  ToggleColumnsResource.put($stateParams, {
                    toggledColumns: scope.toggledColumns
                  });
                };
              }
            }
          });
        }
      }
    };
  };
  return dependencies.concat(toggleColumnsDirective);
});