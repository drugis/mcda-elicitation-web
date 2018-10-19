'use strict';
define([], () => {
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
      ScenarioResource.get($stateParams, function(scenario) { // reload because child scopes may have changed scenario
        var newScenario = {
          title: newTitle,
          state: scenario.state,
          subProblemId: subProblem.id
        };
        ScenarioResource.save(_.omit($stateParams, 'id'), newScenario, function(savedScenario) {
          redirect(savedScenario.id, $state.current.name);
        });
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
      ScenarioResource.save(_.omit($stateParams, 'id'), newScenario, function(savedScenario) {
        var newStateName = 'preferences';
        redirect(savedScenario.id, newStateName);
      });
    }

    function redirect(scenarioId, stateName) {
      var newState = _.omit($stateParams, 'id');
      newState.id = scenarioId;
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
