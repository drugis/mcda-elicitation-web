'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$state',
    '$stateParams',
    'ScenarioResource',
    'WorkspaceService'
  ];
  
  var McdaBenefitRiskService = function(
    $state,
    $stateParams,
    ScenarioResource,
    WorkspaceService
  ) {

    function copyScenarioAndGo(newTitle, subProblem) {
      return ScenarioResource.get($stateParams).$promise // reload because child scopes may have changed scenario
        .then(_.partial(createNewScenario, newTitle, subProblem))
        .then(saveNewScenario)
        .then(goToNewScenario);
    }

    function createNewScenario(newTitle, subProblem, scenario) {
      return {
        title: newTitle,
        state: scenario.state,
        subProblemId: subProblem.id
      };
    }

    function saveNewScenario(newScenario) {
      return ScenarioResource.save(_.omit($stateParams, 'id'), newScenario).$promise;
    }

    function goToNewScenario(savedScenario) {
      redirect(savedScenario.id, $state.current.name);
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
        .then(goToPreferences);
    }

    function goToPreferences(savedScenario) {
      redirect(savedScenario.id, 'preferences');
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
      copyScenarioAndGo: copyScenarioAndGo
    };
  };
  return dependencies.concat(McdaBenefitRiskService);
});
