'use strict';
define(['clipboard', 'require'], function(Clipboard) {
  var dependencies = ['$scope', 'currentScenario', 'taskDefinition', 'MCDAResultsService',
  'WorkspaceService'];

  var SmaaResultsController = function($scope, currentScenario, taskDefinition, MCDAResultsService,
  	WorkspaceService) {
    // init
    $scope.state = MCDAResultsService.getResults($scope, taskDefinition.clean($scope.aggregateState));
    $scope.scenario = currentScenario;
    var clipboard = new Clipboard('.clipboard-button');

    $scope.$watch('problem', function(newProblem) {
    	if(!newProblem){
    		return;
    	}
    	var aggregateState = WorkspaceService.buildAggregateState(newProblem, $scope.subProblem, currentScenario);
    	$scope.state = MCDAResultsService.getResults($scope, taskDefinition.clean(aggregateState));
    }, true);

  };
  return dependencies.concat(SmaaResultsController);
});