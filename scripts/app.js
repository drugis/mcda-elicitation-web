define(
  ['angular',
   'require',
   'underscore',
   'elicit/decision-problem',
   'workspace',
   'components',
   'services'],
  function(angular, require, _) {
    var dependencies = ['elicit.problem-resource', 'elicit.components', 'elicit.services', 'elicit.workspace'];
    var app = angular.module('elicit', dependencies);

    app.run(['$rootScope', function($rootScope) {
      $rootScope.$safeApply = function($scope, fn) {
	var phase = $scope.$root.$$phase;
	if(phase == '$apply' || phase == '$digest') {
	  this.$eval(fn);
	}
	else {
	  this.$apply(fn);
	}
      };
    }]);

    var wizard = {
      'steps' : {
	"choose-problem": {
          controller: "ChooseProblemController",
          templateUrl: "templates/choose-problem.html" },
	"scale-range":
	{ controller: 'ScaleRangeController',
          templateUrl: "templates/scale-range.html" },
	"partial-value-function":
	{ controller: 'PartialValueFunctionController',
          templateUrl: "templates/partial-value-function.html" },
	"ordinal-swing":
	{ controller: 'OrdinalSwingController',
          templateUrl: 'templates/elicit-ordinal.html' },
	"interval-swing":
	{ controller: 'IntervalSwingController',
          templateUrl: 'templates/elicit-ratio-bound.html' },
	"exact-swing":
	{ controller: 'ExactSwingController',
          templateUrl: 'templates/elicit-exact-swing.html' },
	"choose-method":
	{ controller: 'ChooseMethodController',
          templateUrl: 'templates/choose-method.html' },
	"results":
	{ controller: 'ResultsController',
          templateUrl: 'templates/results-page.html' }
      }};

    app.constant('Wizard', wizard);

    _.each(_.pairs(wizard.steps), function(step) {
      var name = step[0];
      var config = step[1];
      app.controller(config.controller, ['$scope', '$injector', function($scope, $injector) {
	require(['wizard/controller/' + name], function(controller) {
          $injector.invoke(controller, this, { '$scope' : $scope });
	});
      }]);
    });

    // example url: /#/workspaces/<id>/<taskname>
    app.config(['Wizard', '$routeProvider', function(Wizard, $routeProvider) {
      _.each(_.pairs(Wizard.steps), function(step) {
	var name = step[0];
	var config = step[1];
	$routeProvider.when('/workspaces/:workspaceId/' + name, { templateUrl: config.templateUrl, controller: config.controller });
      });
      $routeProvider.otherwise({redirectTo: 'workspaces/new/choose-problem'});
    }]);

    return app;
  });
