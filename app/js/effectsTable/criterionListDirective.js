'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    'mcdaRootPath'
  ];
  var CriterionListDirective = function(
    mcdaRootPath) {
    return {
      restrict: 'E',
      scope: {
        'criteria': '=',
        'useFavorability': '='
      },
      templateUrl: mcdaRootPath + 'js/effectsTable/criterionListDirective.html',
      link: function(scope) {
        scope.combineLists=combineLists;
        scope.goUp = goUp;
        scope.goDown = goDown;

        // init
        initializeCriteriaLists();
        scope.$watch(scope.useFavorability, initializeCriteriaLists);

        //
        function initializeCriteriaLists(){
          if(scope.useFavorability){
            scope.favorableCriteria = _.filter(scope.criteria, ['isFavorable', true]);
            scope.unfavorableCriteria = _.filter(scope.criteria, ['isFavorable', false]);
          } else {
            scope.favorableCriteria = scope.criteria;
          }
        }
        function goUp(idx){
          swap(scope.criteria, idx, idx-1);
        }
        function goDown(idx){
          swap(scope.criteria, idx, idx-1);
        }
        function swap(array, idx, newIdx) {
          var mem = array[idx];
          array[idx] = array[newIdx];
          array[newIdx] = mem;
        }
        function combineLists(){
          scope.criteria = scope.favorableCriteria.concat(scope.unfavorableCriteria);
        }
      }
    };
  };
  return dependencies.concat(CriterionListDirective);
});
