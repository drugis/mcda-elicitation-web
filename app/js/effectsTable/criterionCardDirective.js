'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$modal',
    'WorkspaceSettingsService',
    'swap',
    'isMcdaStandalone'
  ];
  var CriterionCardDirective = function(
    $modal,
    WorkspaceSettingsService,
    swap,
    isMcdaStandalone
  ) {
    return {
      restrict: 'E',
      scope: {
        'criterion': '=',
        'canGoUp': '=',
        'canGoDown': '=',
        'goUp': '=',
        'goDown': '=',
        'removeCriterion': '=',
        'idx': '=',
        'editCriterion': '=',
        'isInput': '=',
        'saveOrdering': '=',
        'saveWorkspace': '=',
        'editMode': '='
      },
      templateUrl: '../effectsTable/criterionCardDirective.html',
      link: function(scope) {
        scope.isStandalone = isMcdaStandalone;
        scope.criterionUp = criterionUp;
        scope.criterionDown = criterionDown;
        scope.dataSourceDown = dataSourceDown;
        scope.dataSourceUp = dataSourceUp;
        scope.removeDataSource = removeDataSource;
        scope.editDataSource = editDataSource;

        // init
        scope.INPUT_METHODS = {
          manualDistribution: 'Manual distribution',
          assistedDistribution: 'Assisted distribution'
        };

        scope.PARAMETERS_OF_INTEREST = {
          mean: 'Mean',
          median: 'Median',
          cumulativeProbability: 'Cumulative probability',
          eventProbability: 'Event probability',
          value: 'value'
        };

        setUnit();
        scope.$on('elicit.settingsChanged', setUnit);

        // public 
        function criterionUp() {
          scope.goUp(scope.idx);
          if (!scope.isInput) {
            scope.saveOrdering();
          }
        }

        function criterionDown() {
          scope.goDown(scope.idx);
          if (!scope.isInput) {
            scope.saveOrdering();
          }
        }

        function dataSourceDown(criterion, idx) {
          swapAndSave(criterion.dataSources, idx, idx + 1);
        }

        function dataSourceUp(criterion, idx) {
          swapAndSave(criterion.dataSources, idx, idx - 1);
        }

        function removeDataSource(dataSource) {
          scope.criterion.dataSources = _.reject(scope.criterion.dataSources, ['id', dataSource.id]);
        }

        function editDataSource(dataSource, dataSourceIndex) {
          $modal.open({
            template: scope.isInput ? require('../manualInput/addDataSource.html') : require('../evidence/editDataSource.html'),
            controller: 'EditDataSourceController',
            resolve: {
              callback: function() {
                return function(newDataSource) {
                  if (dataSource) {
                    scope.criterion.dataSources[dataSourceIndex] = newDataSource;
                    if (!scope.isInput) {
                      scope.saveWorkspace(scope.criterion);
                    }
                  } else {
                    scope.criterion.dataSources.push(newDataSource);
                  }
                };
              },
              dataSources: function() {
                return scope.criterion.dataSources;
              },
              dataSource: function() {
                return dataSource;
              }
            }
          });
        }

        // private
        function swapAndSave(array, idx, newIdx) {
          swap(array, idx, newIdx);
          if (!scope.isInput) {
            scope.saveOrdering();
          }
        }

        function setUnit() {
          if (_.isEqual(scope.criterion.dataSources[0].scale, [0, 1])) {
            if (WorkspaceSettingsService.usePercentage()) {
              scope.criterion.unitOfMeasurement = '%';
            } else {
              delete scope.criterion.unitOfMeasurement;
            }
          }
        }
      }
    };
  };
  return dependencies.concat(CriterionCardDirective);
});
