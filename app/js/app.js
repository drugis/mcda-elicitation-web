define(
  ['angular',
   'require',
   'underscore',
   'services/decisionProblem',
   'services/workspace',
   'controllers',
   'components'],
  function(angular, require, _) {
    var dependencies = ['elicit.problem-resource', 'elicit.workspace', 'elicit.components', 'elicit.controllers'];
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

    var tasks = {
      'available' : [
        { id: "choose-problem",
          controller: "ChooseProblemController",
          templateUrl: "chooseProblem.html" },
        { id: "scale-range",
          title: "Define Scale Range",
          controller: 'ScaleRangeController',
          templateUrl: "scaleRange.html" },
        { id: "partial-value-function",
         title: "Define partial value functions",
          controller: 'PartialValueFunctionController',
          templateUrl: "partialValueFunction.html" },
        { id: "ordinal-swing",
          title: "Ordinal Swing Elicitation",
          controller: 'OrdinalSwingController',
          templateUrl: 'ordinalSwing.html' },
        { id: "interval-swing",
          title: "Interval Swing Elicitation",
          controller: 'IntervalSwingController',
          templateUrl: 'intervalSwing.html' },
        { id: "exact-swing",
          title: "Exact Swing Elicitation",
          controller: 'ExactSwingController',
          templateUrl: 'exactSwing.html' },
        { id: "choose-method",
          controller: 'ChooseMethodController',
          templateUrl: 'chooseMethod.html' },
        { id: "results",
          title: "Results",
          controller: 'ResultsController',
          templateUrl: 'results.html' }
      ]};

    app.constant('Tasks', tasks);

    _.each(tasks.available, function(task) {
      var camelCase = function (str) { return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); }); };

      app.controller(task.controller, ['$scope', '$injector', function($scope, $injector) {
        require(['controllers/' + camelCase(task.id)], function(controller) {
          $injector.invoke(controller, this, { '$scope' : $scope });
        });
      }]);
    });

    // example url: /#/workspaces/<id>/<taskname>
    app.config(['Tasks', '$routeProvider', function(Tasks, $routeProvider) {
      _.each(Tasks.available, function(task) {
        var baseTemplatePath = "app/partials/tasks/";
        var templateUrl = baseTemplatePath + task.templateUrl;

        $routeProvider.when('/workspaces/:workspaceId/' + task.id, { templateUrl: templateUrl, controller: task.controller });
      });
      $routeProvider.otherwise({redirectTo: 'workspaces/new/choose-problem'});
    }]);

    return app;
  });
