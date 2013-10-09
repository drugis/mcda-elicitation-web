define(
  ['angular',
   'require',
   'underscore',
   'services/decisionProblem',
   'services/workspace',
   'components'],
  function(angular, require, _) {
    var dependencies = ['elicit.problem-resource', 'elicit.components', 'elicit.workspace'];
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
          templateUrl: "chooseProblem.html" },
        "scale-range":
        { controller: 'ScaleRangeController',
          templateUrl: "scaleRange.html" },
        "partial-value-function":
        { controller: 'PartialValueFunctionController',
          templateUrl: "partialValueFunction.html" },
        "ordinal-swing":
        { controller: 'OrdinalSwingController',
          templateUrl: 'ordinalSwing.html' },
        "interval-swing":
        { controller: 'IntervalSwingController',
          templateUrl: 'intervalSwing.html' },
        "exact-swing":
        { controller: 'ExactSwingController',
          templateUrl: 'exactSwing.html' },
        "choose-method":
        { controller: 'ChooseMethodController',
          templateUrl: 'chooseMethod.html' },
        "results":
        { controller: 'ResultsController',
          templateUrl: 'results.html' }
      }};

    app.constant('Wizard', wizard);

    _.each(_.pairs(wizard.steps), function(step) {
      var name = step[0];
      var config = step[1];
      var camelCase = function (str) { return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); }); };
      app.controller(config.controller, ['$scope', '$injector', function($scope, $injector) {
        require(['controllers/' + camelCase(name)], function(controller) {
          $injector.invoke(controller, this, { '$scope' : $scope });
        });
      }]);
    });

    // example url: /#/workspaces/<id>/<taskname>
    app.config(['Wizard', '$routeProvider', function(Wizard, $routeProvider) {
      _.each(_.pairs(Wizard.steps), function(step) {
        var name = step[0];
        var config = step[1];
        var baseTemplatePath = "app/partials/tasks/";
        var templateUrl = baseTemplatePath + config.templateUrl;

        $routeProvider.when('/workspaces/:workspaceId/' + name, { templateUrl: templateUrl, controller: config.controller });
      });
      $routeProvider.otherwise({redirectTo: 'workspaces/new/choose-problem'});
    }]);

    return app;
  });
