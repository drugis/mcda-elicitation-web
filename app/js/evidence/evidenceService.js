'use strict';
define(['lodash', 'angular'], function(_) {
  var dependencies = [];
  var EvidenceService = function() {

    function editCriterion(oldCriterion, newCriterion, problem) {
      var editedProblem = _.cloneDeep(problem);
      if (oldCriterion.title === newCriterion.title) {
        editedProblem.criteria[newCriterion.title] = newCriterion;
      } else {
        delete editedProblem.criteria[oldCriterion.title];
        editedProblem.criteria[newCriterion.title] = newCriterion;
        editedProblem.performanceTable = editedProblem.performanceTable.map(function(entry) {
          if (entry.criterion === oldCriterion.title) {
            entry.criterion = newCriterion.title;
          }
          return entry;
        });
      }
      return editedProblem;
    }

    function renameCriterionInSubProblems(oldCriterion, newCriterion, subProblems) {
      return _.map(subProblems, function(subProblem) {
        var newSubProblem = _.cloneDeep(subProblem);
        if (_.find(subProblem.definition.excludedCriteria, function(criterion) {
            return criterion === oldCriterion.title;
          })) {
          newSubProblem.definition.excludedCriteria = _.remove(newSubProblem.definition.excludedCriteria, oldCriterion.title);
          newSubProblem.definition.excludedCriteria.push(newCriterion.title);
        } else {
          newSubProblem.definition.ranges[newCriterion.title] = newSubProblem.definition.ranges[oldCriterion.title];
          delete newSubProblem.definition.ranges[oldCriterion.title];
        }
        return newSubProblem;
      });
    }

    function renameCriterionInScenarios(oldCriterion, newCriterion, scenarios) {
      return _.map(scenarios, function(scenario) {
        var newScenario = _.cloneDeep(scenario);
        var scenariosCriterion = _.find(scenario.state.problem.criteria, ['title', oldCriterion.title]);
        if (scenariosCriterion) {
          scenariosCriterion.title = newCriterion.title;
          newScenario.state.problem.criteria[newCriterion.title] = scenariosCriterion;
          delete newScenario.state.problem.criteria[oldCriterion.title];
        }

        if (newScenario.state.prefs) {
          for (var i = 0; i < newScenario.state.prefs.length; i++) {
            if (newScenario.state.prefs[i].criteria[0] === oldCriterion.title) {
              newScenario.state.prefs[i].criteria[0] = newCriterion.title;
            }
            if (newScenario.state.prefs[i].criteria[1] === oldCriterion.title) {
              newScenario.state.prefs[i].criteria[1] = newCriterion.title;
            }
          }
        }
        return newScenario;
      });
    }

    return {
      editCriterion: editCriterion,
      renameCriterionInSubProblems: renameCriterionInSubProblems,
      renameCriterionInScenarios: renameCriterionInScenarios
    };

  };
  return dependencies.concat(EvidenceService);
});