'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$modal',
    '$state',
    '$stateParams',
    'mcdaRootPath',
    'OrderingService',
    'WorkspaceResource'
  ];
  var CriterionListDirective = function(
    $modal,
    $state,
    $stateParams,
    mcdaRootPath,
    OrderingService,
    WorkspaceResource
  ) {
    return {
      restrict: 'E',
      scope: {
        'criteria': '=',
        'useFavorability': '=',
        'removeCriterionCallback': '=',
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
                return function(newCriterion, favorabilityChanged) {
                  if (criterion) { // editing not adding
                    removeCriterion(_.findIndex(scope.criteria, ['id', criterion.id]));
                  }
                  scope.criteria.push(newCriterion);
                  if (scope.isInput) {
                    initializeCriteriaLists();
                  } else {
                    var criterionId = newCriterion.id;
                    scope.workspace.problem.criteria[criterionId] = _.omit(newCriterion, 'id');
                    if (favorabilityChanged) {
                      changeFavorability(criterionId);
                    }
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
          OrderingService.saveOrdering($stateParams,
            scope.favorableCriteria.concat(scope.unfavorableCriteria),
            _.map(scope.workspace.problem.alternatives,
              function(alternative, alternativeId) {
                return _.merge({}, { id: alternativeId }, alternative);
              }
            )
          );
        }

        //private
        function changeFavorability(criterionId) {
          var toRemove = !!_.find(scope.useFavorability.children[0].criteria, function(crit) {
            return crit === criterionId;
          }) ? 0 : 1;
          var toAdd = toRemove === 1 ? 0 : 1;
          _.remove(scope.useFavorability.children[toRemove].criteria, function(crit) {
            return crit === criterionId;
          });
          scope.useFavorability.children[toAdd].criteria.push(criterionId);
        }

        function initializeCriteriaLists() {
          if (scope.isInput) {
            checkForUnknownCriteria();
            checkForMissingFavorability();
          }
          if (scope.useFavorability) {
            var partition;
            if (scope.isInput) {
              partition = _.partition(scope.criteria, ['isFavorable', true]);
            } else {
              partition = _.partition(scope.criteria, function(criterion) {
                return _.includes(scope.useFavorability.children[0].criteria, criterion.id);
              });
            }
            scope.favorableCriteria = partition[0];
            scope.unfavorableCriteria = partition[1];
            scope.criteria = partition[0].concat(partition[1]);
          } else {
            scope.favorableCriteria = scope.criteria;
          }
        }

        function swapAndInitialize(array, idx, newIdx) {
          var mem = array[idx];
          array[idx] = array[newIdx];
          array[newIdx] = mem;
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
