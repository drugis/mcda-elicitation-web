'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$modal',
    '$state',
    '$stateParams',
    'OrderingService',
    'WorkspaceResource',
    'swap'
  ];
  var CriterionListDirective = function(
    $modal,
    $state,
    $stateParams,
    OrderingService,
    WorkspaceResource,
    swap
  ) {
    return {
      restrict: 'E',
      scope: {
        'criteria': '=',
        'useFavorability': '=',
        'inputData': '=',
        'isInput': '=',
        'workspace': '=',
        'editMode': '=',
        'scales': '=',
        'alternatives': '=',
        'effectsTableInfo': '='
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
                  scope.criteria[_.findIndex(scope.criteria, ['id', criterion.id])] = newCriterion;
                  initializeCriteriaLists();
                  if (!scope.isInput) {
                    saveWorkspace(newCriterion);
                  }
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

        function saveOrdering() {
          function decorateWithId(alternative, alternativeId) {
            return _.merge({}, { id: alternativeId }, alternative);
          }
          var criteria = scope.favorableCriteria.concat(scope.unfavorableCriteria);
          OrderingService.saveOrdering($stateParams, criteria,
            _.map(scope.workspace.problem.alternatives, decorateWithId)
          );
        }

        function saveWorkspace(criterion) {
          scope.workspace.problem.criteria[criterion.id] = _.omit(criterion, 'id');
          saveOrdering();
          WorkspaceResource.save($stateParams, scope.workspace).$promise.then(function() {
            $state.reload(); //must reload to update effectsTable
          });
        }

        //private
        function initializeCriteriaLists() {
          var partition = _.partition(scope.criteria, ['isFavorable', true]);
          scope.criteria = partition[0].concat(partition[1]);
          scope.favorableCriteria = partition[0];
          scope.unfavorableCriteria = partition[1];
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
