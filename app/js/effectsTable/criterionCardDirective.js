'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    'mcdaRootPath'
  ];
  var CriterionCardDirective = function(
    mcdaRootPath) {
    return {
      restrict: 'E',
      scope: {
        'criterion': '=',
        'canGoUp': '=',
        'canGoDown': '=',
        'goUp': '=',
        'goDown': '=',
        'idx': '='
      },
      templateUrl: mcdaRootPath + 'js/effectsTable/criterionCardDirective.html',
      link: function(scope) {
        scope.criterionUp = criterionUp;
        scope.criterionDown = criterionDown;
        scope.dataSourceDown = dataSourceDown;
        scope.dataSourceUp = dataSourceUp;
        
        // init
        function criterionUp() {
          scope.goUp(scope.idx);
        }

        function criterionDown() {
          scope.goUp(scope.idx);
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
      }
    };
  };
  return dependencies.concat(CriterionCardDirective);
});
