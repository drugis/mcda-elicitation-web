'use strict';
define(['lodash'], (_) => {
  var dependencies = [
    '$state',
    '$stateParams',
    'ScenarioResource',
    'WorkspaceService'
  ];
  var McdaBenefitRiskService = (
    $state,
    $stateParams,
    ScenarioResource,
    WorkspaceService
  ) => {

    function forkScenarioAndGo(newTitle, subProblem) {
      return ScenarioResource.get($stateParams).$promise // reload because child scopes may have changed scenario
        .then((scenario) => {
          return {
            title: newTitle,
            state: scenario.state,
            subProblemId: subProblem.id
          };
        }).then((newScenario) => {
          return ScenarioResource.save(_.omit($stateParams, 'id'), newScenario).$promise;
        }).then((savedScenario) => {
          redirect(savedScenario.id, $state.current.name);
        });
    }

    function newScenarioAndGo(newTitle, workspace, subProblem) {
      var mergedProblem = WorkspaceService.mergeBaseAndSubProblem(workspace.problem, subProblem.definition);
      var newScenario = {
        title: newTitle,
        state: {
          problem: WorkspaceService.reduceProblem(mergedProblem)
        },
        workspace: workspace.id,
        subProblemId: subProblem.id
      };
      return ScenarioResource.save(_.omit($stateParams, 'id'), newScenario).$promise
        .then((savedScenario) => {
          redirect(savedScenario.id, 'preferences');
        });
    }

    function redirect(scenarioId, stateName) {
      var newState = _.merge({}, $stateParams, {
        id: scenarioId
      });
      $state.go(stateName, newState, {
        reload: true
      });
    }


    return {
      newScenarioAndGo: newScenarioAndGo,
      forkScenarioAndGo: forkScenarioAndGo
    };
  };
  return dependencies.concat(McdaBenefitRiskService);
});
