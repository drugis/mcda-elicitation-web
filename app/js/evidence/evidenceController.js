'use strict';
define(['clipboard', 'require'], function(Clipboard, require) {
  var _ = require('lodash');
  var dependencies = ['$scope', '$state', '$stateParams', '$modal', '$q',
    'EffectsTableService',
    'EvidenceService',
    'SubProblemResource',
    'ScenarioResource',
    'WorkspaceResource',
    'mcdaRootPath'
  ];

  var EvidenceController = function($scope, $state, $stateParams, $modal, $q,
    EffectsTableService,
    EvidenceService,
    SubProblemResource,
    ScenarioResource,
    WorkspaceResource,
    mcdaRootPath) {
    // functions
    $scope.isExact = isExact;
    $scope.editTherapeuticContext = editTherapeuticContext;
    $scope.editCriterion = editCriterion;

    // init
    $scope.scales = $scope.workspace.scales.observed;
    $scope.valueTree = $scope.workspace.$$valueTree;
    $scope.problem = $scope.workspace.problem;
    $scope.effectsTableData = EffectsTableService.buildEffectsTableData($scope.problem, $scope.valueTree);
    $scope.nrAlternatives = _.keys($scope.problem.alternatives).length;
    $scope.isStandAlone = mcdaRootPath === '/app/';
    $scope.references = {
      has: _.find($scope.effectsTableData, function(effectsTableRow) {
        return _.find(effectsTableRow.criteria, function(criterion) {
          return criterion.source;
        });
      })
    };

    $scope.$watch('workspace.scales.observed', function(newValue) {
      $scope.scales = newValue;
    }, true);
    var clipboard = new Clipboard('.clipboard-button');

    function isExact(criterion, alternative) {
      var perf = _.find($scope.problem.performanceTable, function(performance) {
        return performance.alternative === alternative && performance.criterion === criterion;
      });
      return !!perf && perf.performance.type === 'exact';
    }

    function editTherapeuticContext() {
      $modal.open({
        templateUrl: '/app/js/evidence/editTherapeuticContext.html',
        controller: 'EditTherapeuticContextController',
        resolve: {
          therapeuticContext: function() {
            return $scope.problem.description;
          },
          callback: function() {
            return function(newTherapeuticContext) {
              $scope.problem.description = newTherapeuticContext;
              WorkspaceResource.save($stateParams, $scope.workspace);
            };
          }
        }
      });
    }

    function editCriterion(criterion) {
      $modal.open({
        templateUrl: '/app/js/evidence/editCriterion.html',
        controller: 'EditCriterionController',
        resolve: {
          criterion: function() {
            return criterion;
          },
          callback: function() {
            return function(newCriterion) {
              $scope.workspace.problem = EvidenceService.editCriterion(criterion, newCriterion, $scope.problem);
              var workspacePromise = WorkspaceResource.save($stateParams, $scope.workspace).$promise;
              if (criterion.title !== newCriterion.title) {
                var subProblemPromises;
                SubProblemResource.query().$promise.then(function(subProblems) {
                  var newProblems = EvidenceService.renameCriterionInSubProblems(criterion, newCriterion, subProblems);
                  subProblemPromises = _.map(newProblems, function(newProblem) {
                    return SubProblemResource.save(newProblem).$promise;
                  });
                });

                var scenarioPromises;
                ScenarioResource.query().$promise.then(function(scenarios) {
                  var newScenarios = EvidenceService.renameCriterionInScenarios(criterion, newCriterion, scenarios);
                  scenarioPromises = _.map(newScenarios, function(newScenario) {
                    return ScenarioResource.save(newScenario).$promise;
                  });
                });

                $q.all(subProblemPromises.concat(scenarioPromises).concat([workspacePromise])).then($state.reload);

              } else {
                workspacePromise.then(function() {
                  $state.reload();
                });
              }
            };
          }
        }
      });
    }

  };
  return dependencies.concat(EvidenceController);
});