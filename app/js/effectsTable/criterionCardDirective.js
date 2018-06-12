'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$modal',
    'mcdaRootPath',
    'swap'
  ];
  var CriterionCardDirective = function(
    $modal,
    mcdaRootPath,
    swap
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
        'saveOrdering': '='
      },
      templateUrl: mcdaRootPath + 'js/effectsTable/criterionCardDirective.html',
      link: function(scope) {
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

        function editDataSource(oldDataSourceIdx) {
          $modal.open({
            templateUrl: scope.isInput ? '/js/manualInput/addDataSource.html' : '/js/evidence/editDataSource.html',
            controller: scope.isInput ? 'AddDataSourceController' : 'EditDataSourceController',
            resolve: {
              callback: function() {
                return function(newDataSource) {
                  if (oldDataSourceIdx >= 0) {
                    scope.criterion.dataSources[oldDataSourceIdx] = newDataSource;
                  } else {
                    scope.criterion.dataSources.push(newDataSource);
                  }
                };
              },
              criterion: function() {
                return scope.criterion;
              },
              oldDataSourceIdx: function() {
                return oldDataSourceIdx;
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
      }
    };
  };
  return dependencies.concat(CriterionCardDirective);
});
