'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$modal',
    'mcdaRootPath'
  ];
  var CriterionCardDirective = function(
    $modal,
    mcdaRootPath
  ) {
    return {
      restrict: 'E',
      scope: {
        'criterion': '=',
        'canGoUp': '=',
        'canGoDown': '=',
        'goUp': '=',
        'goDown': '=',
        'removeCriterion':'=',
        'idx': '=',
        'editCriterion':'='
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
        function criterionUp() {
          scope.goUp(scope.idx);
        }

        function criterionDown() {
          scope.goDown(scope.idx);
        }

        function dataSourceDown(criterion, idx) {
          swap(criterion.dataSources, idx, idx + 1);
        }

        function dataSourceUp(criterion, idx) {
          swap(criterion.dataSources, idx, idx - 1);
        }

        function swap(array, idx, newIdx) {
          var mem = array[idx];
          array[idx] = array[newIdx];
          array[newIdx] = mem;
        }

        function removeDataSource(dataSource) {
          scope.criterion.dataSources = _.reject(scope.criterion.dataSources, ['id', dataSource.id]);
        }

        function editDataSource(oldDataSourceIdx) {
          $modal.open({
            templateUrl: '/js/manualInput/addDataSource.html',
            controller: 'AddDataSourceController',
            resolve: {
              callback: function() {
                return function(newDataSource) {
                  if (oldDataSourceIdx>=0) {
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
      }
    };
  };
  return dependencies.concat(CriterionCardDirective);
});
