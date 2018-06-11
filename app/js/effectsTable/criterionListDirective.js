'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$modal',
    'mcdaRootPath'
  ];
  var CriterionListDirective = function(
    $modal,
    mcdaRootPath
  ) {
    return {
      restrict: 'E',
      scope: {
        'criteria': '=',
        'useFavorability': '=',
        'removeCriterionCallback': '=',
        'inputData': '=',
        'errors': '='
      },
      templateUrl: mcdaRootPath + 'js/effectsTable/criterionListDirective.html',
      link: function(scope) {
        scope.combineLists = combineLists;
        scope.goUp = goUp;
        scope.goDown = goDown;
        scope.removeCriterion = removeCriterion;
        scope.openCriterionModal = openCriterionModal;

        // init
        initializeCriteriaLists();
        scope.$watch('useFavorability', initializeCriteriaLists);

        //public
        function goUp(idx) {
          swap(scope.criteria, idx, idx - 1);
          initializeCriteriaLists();
        }

        function goDown(idx) {
          swap(scope.criteria, idx, idx + 1);
          initializeCriteriaLists();
        }

        function combineLists() {
          scope.criteria = scope.favorableCriteria.concat(scope.unfavorableCriteria);
        }

        function removeCriterion(idx) {
          if (scope.inputData) {
            delete scope.inputData[scope.criteria[idx].id];
          }
          scope.criteria.splice(idx, 1);
          initializeCriteriaLists();
        }

        function openCriterionModal(criterion) {
          $modal.open({
            templateUrl: '/js/manualInput/addCriterion.html',
            controller: 'AddCriterionController',
            resolve: {
              criteria: function() {
                return scope.criteria;
              },
              callback: function() {
                return function(newCriterion) {
                  if (criterion) { // editing not adding
                    removeCriterion(_.findIndex(scope.criteria, ['id', criterion.id]));
                  }
                  scope.criteria.push(newCriterion);
                  initializeCriteriaLists();

                };
              },
              oldCriterion: function() {
                return criterion;
              },
              useFavorability: function() {
                return scope.useFavorability;
              }
            }
          });
        }

        //private
        function initializeCriteriaLists() {
          checkForUnknownCriteria();
          checkForMissingFavorability();
          if (scope.useFavorability) {
            var partition = _.partition(scope.criteria, ['isFavorable', true]);
            scope.favorableCriteria = partition[0];
            scope.unfavorableCriteria = partition[1];
          } else {
            scope.favorableCriteria = scope.criteria;
          }
        }

        function swap(array, idx, newIdx) {
          var mem = array[idx];
          array[idx] = array[newIdx];
          array[newIdx] = mem;
        }

        function checkForMissingFavorability() {
          var error = 'Missing favorability';
          _.pull(scope.errors, error);
          if (scope.useFavorability && _.find(scope.criteria, function(criterion) {
            return criterion.isFavorable === undefined;
          })) {
            scope.errors.push('Missing favorability');
          }
        }

        function checkForUnknownCriteria() {
          var error = 'Unknown input type';
          _.pull(scope.errors, error);
          if (_.find(scope.criteria, function(criterion) {
            return _.find(criterion.dataSources, function(dataSource){
              return !dataSource.inputType;
            });
          })) {
            scope.errors.push(error);
          }
        }
      }
    };
  };
  return dependencies.concat(CriterionListDirective);
});
