'use strict';
define([
  'clipboard'
], function(
  Clipboard
) {

  var dependencies = [
    '$scope',
    '$modal',
    '$stateParams',
    '$state',
    'ScenarioService',
    'ScenarioResource',
    'PageTitleService'
  ];
  var PreferencesController = function(
    $scope,
    $modal,
    $stateParams,
    $state,
    ScenarioService,
    ScenarioResource,
    PageTitleService
  ) {
    // functions
    $scope.editScenarioTitle = editScenarioTitle;
    $scope.copyScenario = copyScenario;
    $scope.newScenario = newScenario;

    new Clipboard('.clipboard-button');

    $scope.scalesPromise.then(function() {
      PageTitleService.setPageTitle('PreferencesController', ($scope.aggregateState.problem.title || $scope.workspace.title) + '\'s preferences');
    });

    function editScenarioTitle() {
      $modal.open({
        templateUrl: '../preferences/editScenarioTitle.html',
        controller: 'EditScenarioTitleController',
        resolve: {
          scenario: function() {
            return $scope.scenario;
          },
          scenarios: function() {
            return $scope.scenarios;
          },
          callback: function() {
            return function(newTitle) {
              $scope.scenario.title = newTitle;
              ScenarioResource.save($stateParams, $scope.scenario).$promise.then(function() {
                $state.reload();
              });
            };
          }
        }
      });
    }

    function copyScenario() {
      $modal.open({
        templateUrl: '../preferences/newScenario.html',
        controller: 'NewScenarioController',
        resolve: {
          scenarios: function() {
            return $scope.scenarios;
          },
          type: function() {
            return 'Copy';
          },
          callback: function() {
            return function(newTitle) {
              ScenarioService.copyScenarioAndGo(newTitle, $scope.subProblem);
            };
          }
        }
      });
    }

    function newScenario() {
      $modal.open({
        templateUrl: '../preferences/newScenario.html',
        controller: 'NewScenarioController',
        resolve: {
          scenarios: function() {
            return $scope.scenarios;
          },
          type: function() {
            return 'New';
          },
          callback: function() {
            return function(newTitle) {
              ScenarioService.newScenarioAndGo(newTitle, $scope.workspace, $scope.subProblem);
            };
          }
        }
      });
    }

  };
  return dependencies.concat(PreferencesController);
});
