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
        if (!problem.valueTree) {
          problem.valueTree = {
            'title': 'Overall value',
            'criteria': _.keys(problem.criteria)
          };
        }
        return problem;
      }

      return {
        createWorkspace: createWorkspace
      };
    };

    return angular.module('elicit.workspaceService', dependencies).factory('WorkspaceService', WorkspaceService);
  });