'use strict';
define(['lodash', 'angular'], function(_, angular) {
  var dependencies = [
    '$modal',
    '$stateParams',
    'OrderingService',
    'WorkspaceResource',
    'swap'
  ];
  var CriterionListDirective = function(
    $modal,
    $stateParams,
    OrderingService,
    WorkspaceResource,
    swap
  ) {
    return {
      restrict: 'E',
      scope: {
        'alternatives': '=',
        'criteria': '=',
        'editMode': '=',
        'effectsTableInfo': '=',
        'inputData': '=',
        'isInput': '=',
        'scales': '=',
        'useFavorability': '=',
        'workspace': '='
      },
      templateUrl: '../effectsTable/criterionListDirective.html',
      link: function(scope) {
        scope.goUp = goUp;
        scope.goDown = goDown;
        scope.removeCriterion = removeCriterion;
        scope.openCriterionModal = openCriterionModal;
        scope.saveOrdering = saveOrdering;
        scope.saveWorkspace = saveWorkspace;

        // init
        initializeCriteriaLists();
        scope.$watch('useFavorability', initializeCriteriaLists);
        scope.$watch('criteria', initializeCriteriaLists, true);
        //public
        function goUp(idx) {
          swapAndInitialize(scope.criteria, idx, idx - 1);
        }

        function goDown(idx) {
          swapAndInitialize(scope.criteria, idx, idx + 1);
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
            templateUrl: '../evidence/editCriterion.html',
            controller: 'EditCriterionController',
            resolve: {
              criteria: function() {
                return scope.criteria;
              },
              callback: function() {
                return function(newCriterion) {
                  replaceOrderedCriterion(criterion.id, newCriterion);
                  initializeCriteriaLists();
                  if (!scope.isInput) {
                    saveWorkspace(newCriterion, criterion.id);
                  }
                };
              },
              oldCriterion: function() {
                if (scope.isInput) {
                  return criterion;
                } else {
                  return scope.workspace.problem.criteria[criterion.id];
                }
              },
              useFavorability: function() {
                return scope.useFavorability;
              }
            }
          });
        }

        function replaceOrderedCriterion(criterionId, newCriterion) {
          var criterionIndex = _.findIndex(scope.criteria, ['id', criterionId]);
          scope.criteria[criterionIndex] = _.merge({},
            _.find(scope.criteria, ['id', criterionId]),
            newCriterion
          );
        }

        function saveOrdering() {
          OrderingService.saveOrdering(
            $stateParams,
            scope.criteria,
            scope.alternatives
          );
        }

        function saveWorkspace(criterion, criterionId) {
          var newCriterion = angular.copy(criterion);
          delete newCriterion.id;
          scope.workspace.problem.criteria[criterionId] = newCriterion;
          WorkspaceResource.save($stateParams, scope.workspace);
        }

        function initializeCriteriaLists() {
          if (scope.useFavorability) {
            var partition = _.partition(scope.criteria, ['isFavorable', true]);
            scope.criteria = partition[0].concat(partition[1]);
            scope.favorableCriteria = partition[0];
            scope.unfavorableCriteria = partition[1];
          }
        }

        function swapAndInitialize(array, idx, newIdx) {
          swap(array, idx, newIdx);
          initializeCriteriaLists();
        }
      }
    };
  };
  return dependencies.concat(CriterionListDirective);
});
