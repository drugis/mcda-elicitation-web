'use strict';
define(['angular'],
  function(angular) {

    var dependencies = [];

    var WorkspaceService = function() {

      function createWorkspace(problem) {
        var workspace = {
          title: problem.title,
          problem: addValuetree(problem)
        };
        return WorkspaceResource.$save(workspace, function(savedWorkspace) {
          var scenario = {
            title: 'Default',
            workspaceId: savedWorkspace.id,
            state: {
              problem: problem
            }
          };
          scenario.$save(function(scenario) {
            savedWorkspace.defaultScenarioId = scenario.id;
            savedWorkspace.$save(function() {
              savedWorkspace.scenarios = {};
              savedWorkspace.scenarios[scenario.id] = scenario;
            });
          });
        });
      }

      function addValueTree(problem) {
        var newProblem = angular.copy(problem);
        if (!newProblem.valueTree) {
          newProblem.valueTree = {
            'title': 'Overall value',
            'criteria': _.keys(problem.criteria)
          };
        }
        return newProblem;
      }

      return {
        addValueTree: addValueTree,
        createWorkspace: createWorkspace
      };
    };

    return angular.module('elicit.workspaceService', dependencies).factory('WorkspaceService', WorkspaceService);
  });