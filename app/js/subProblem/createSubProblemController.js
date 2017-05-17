'use strict';
define(function(require) {
  require('angular');
  var _ = require('lodash');

  var dependencies = ['$scope', '$stateParams', '$modalInstance', 'ScenarioResource', 'SubProblemResource', 'SubProblemService',
    'subProblemState', 'subProblems','problem', 'callback'
  ];
  var CreateSubProblemController = function($scope, $stateParams, $modalInstance, ScenarioResource, SubProblemResource, SubProblemService,
    subProblemState, subProblems, problem, callback) {
    // vars
    $scope.subProblemState = subProblemState;
    $scope.subProblems = subProblems;
    $scope.problem = problem;

    // functions
    $scope.checkDuplicateTitle = checkDuplicateTitle;
    $scope.createProblemConfiguration = createProblemConfiguration;
    $scope.cancel = cancel;

    checkDuplicateTitle($scope.subProblemState.title);

    function createProblemConfiguration() {
      var subProblemCommand = {
        definition: SubProblemService.createDefinition($scope.problem, $scope.subProblemState),
        title: $scope.subProblemState.title,
        scenarioState: SubProblemService.createDefaultScenarioState($scope.problem, $scope.subProblemState)
      };
      SubProblemResource.save(_.omit($stateParams, ['id', 'problemId', 'userUid']), subProblemCommand)
        .$promise.then(function(newProblem) {
          ScenarioResource.query(_.extend({}, _.omit($stateParams, 'id'), {
            problemId: newProblem.id
          })).$promise.then(function(scenarios) {
            callback(newProblem.id, scenarios[0].id);
            $modalInstance.close();
          });
        });
    }


    function checkDuplicateTitle(title) {
      $scope.isTitleDuplicate = _.find($scope.subProblems, ['title', title]);
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }

  };
  return dependencies.concat(CreateSubProblemController);
});
