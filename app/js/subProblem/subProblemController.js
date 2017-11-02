'use strict';
define(['lodash', 'angular', 'clipboard'], function(_, angular, Clipboard) {

  var dependencies = ['$scope', '$stateParams', '$modal', '$state',
    'intervalHull', 'SubProblemService', 'mcdaRootPath'
  ];

  var SubProblemController = function($scope, $stateParams, $modal, $state,
    intervalHull, SubProblemService, mcdaRootPath) {
    $scope.intervalHull = intervalHull;
    $scope.openCreateDialog = openCreateDialog;
    $scope.problem = _.cloneDeep($scope.workspace.problem);
    $scope.isExact = _.partial(SubProblemService.isExact, $scope.problem.performanceTable);
    $scope.isBaseline = SubProblemService.determineBaseline($scope.problem.performanceTable, $scope.problem.alternatives);
    $scope.scalesPromise.then(function(scales) {
      $scope.scales = scales;
    });

    $scope.mergedProblem = {
      alternatives: _.cloneDeep(_.omit($scope.problem.alternatives, $scope.subProblem.definition.excludedAlternatives)),
      criteria: _.cloneDeep(_.omit($scope.problem.criteria, $scope.subProblem.definition.excludedCriteria))
    };

    $scope.mergedProblem.criteria = _.merge($scope.mergedProblem.criteria, $scope.subProblem.definition.ranges);
    var clipboard = new Clipboard('.clipboard-button');

    function openCreateDialog() {
      $modal.open({
        templateUrl: mcdaRootPath + 'js/subProblem/createSubProblem.html',
        controller: 'CreateSubProblemController',
        size: 'large',
        resolve: {
          subProblems: function() {
            return $scope.subProblems;
          },
          subProblem: function() {
            return $scope.subProblem;
          },
          problem: function() {
            return $scope.problem;
          },
          scales: function() {
            return $scope.scales;
          },
          callback: function() {
            return function(newProblemId, newScenarioId) {
              $state.go('problem', _.extend({}, $stateParams, {
                problemId: newProblemId,
                id: newScenarioId
              }));
            };
          }
        }
      });
    }

  };

  return dependencies.concat(SubProblemController);
});