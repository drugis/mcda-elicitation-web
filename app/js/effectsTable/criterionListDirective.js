'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$modal',
    '$state',
    '$stateParams',
    'mcdaRootPath',
    'OrderingService',
    'WorkspaceResource',
    'swap'
  ];
  var CriterionListDirective = function(
    $modal,
    $state,
    $stateParams,
    mcdaRootPath,
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
        'errors': '=',
        'isInput': '=',
        'workspace': '='
      },
      templateUrl: mcdaRootPath + 'js/effectsTable/criterionListDirective.html',
      link: function(scope) {
        scope.goUp = goUp;
        scope.goDown = goDown;
        scope.removeCriterion = removeCriterion;
        scope.openCriterionModal = openCriterionModal;
        scope.saveOrdering = saveOrdering;
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
            templateUrl: scope.isInput ? '/js/manualInput/addCriterion.html' : '/js/evidence/editCriterion.html',
            controller: scope.isInput ? 'AddCriterionController' : 'EditCriterionController',
            resolve: {
              criteria: function() {
                return scope.criteria;
              },
              callback: function() {
                return function(newCriterion) {
                  removeCriterion(_.findIndex(scope.criteria, ['id', criterion.id]));
                  scope.criteria.push(newCriterion);
                  if (scope.isInput) {
                    initializeCriteriaLists();
                  } else {
                    var criterionId = newCriterion.id;
                    scope.workspace.problem.criteria[criterionId] = _.omit(newCriterion, 'id');
                    initializeCriteriaLists();
                    saveOrdering();
                    WorkspaceResource.save($stateParams, scope.workspace).$promise.then(function() {
                      $state.reload(); //must reload to update effectsTable
                    });
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

          OrderingService.saveOrdering($stateParams,
            scope.favorableCriteria.concat(scope.unfavorableCriteria),
            _.map(scope.workspace.problem.alternatives, decorateWithId)
          );
        }

        //private
        function initializeCriteriaLists() {
          if (scope.isInput) {
            checkForUnknownCriteria();
            checkForMissingFavorability();
          }
          if (scope.useFavorability) {
            var partition = _.partition(scope.criteria, ['isFavorable', true]);
            scope.favorableCriteria = partition[0];
            scope.unfavorableCriteria = partition[1];
            scope.criteria = partition[0].concat(partition[1]); // TODO: fix ordering service bug that makes this line necessary then delete
          } else {
            scope.favorableCriteria = scope.criteria;
          }
        }

        function swapAndInitialize(array, idx, newIdx) {
          swap(array, idx, newIdx);
          initializeCriteriaLists();
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
            return _.find(criterion.dataSources, function(dataSource) {
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
