define(
  ['angular',
   'require',
   'underscore',
   'config',
   'services/decisionProblem',
   'services/workspace',
   'services/taskDependencies',
   'foundation.dropdown',
   'foundation.tooltip',
   'controllers',
   'components'],
  function(angular, require, _, Config) {
    var dependencies = ['elicit.problem-resource',
                        'elicit.workspace',
                        'elicit.components',
                        'elicit.controllers',
                        'elicit.taskDependencies'];
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
      $rootScope.$on('patavi.error', function(e, message) {
        $rootScope.$safeApply($rootScope, function() {
          $rootScope.error = message;
        });
      });
      $rootScope.createPath = function(workspaceId, scenarioId, taskId) {
        taskId = taskId ? taskId : Config.defaultView;
        return "#/workspaces/" + workspaceId + "/scenarios/" + scenarioId + "/" + taskId;
        };
    }]);

    app.constant('Tasks', Config.tasks);
    _.each(Config.tasks.available, function(task) {
      var camelCase = function (str) { return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); }); };

      app.controller(task.controller, ['$scope', '$injector', function($scope, $injector) {
        require(['controllers/' + camelCase(task.id)], function(controller) {
          $injector.invoke(controller, this, { '$scope' : $scope });
        });
      }]);
    });

    app.controller("ChooseProblemController", ['$scope', '$injector', function($scope, $injector) {
      require(['controllers/' + 'chooseProblem'], function(controller) {
        $injector.invoke(controller, this, { '$scope' : $scope });
     });
    }]);

    // example url: /#/workspaces/<id>/<taskname>
    app.config(['Tasks', '$routeProvider', function(Tasks, $routeProvider) {

      var baseTemplatePath = "app/views/";
      _.each(Tasks.available, function(task) {
        var templateUrl = baseTemplatePath + task.templateUrl;
        $routeProvider
          .when('/workspaces/:workspaceId/scenarios/:scenarioId/' + task.id,
                { templateUrl: templateUrl, controller: task.controller });
      });

      // Default route
      $routeProvider.when('/choose-problem', { templateUrl: baseTemplatePath + 'chooseProblem.html',
                                               controller: "ChooseProblemController" });
      $routeProvider.otherwise({redirectTo: '/choose-problem'});
    }]);

    app.run(function() {
      $(document).foundation();
      // from http://stackoverflow.com/questions/16952244/what-is-the-best-way-to-close-a-dropdown-in-zurb-foundation-4-when-clicking-on-a
      $('.f-dropdown').click(function() {
        if ($(this).hasClass('open')) {
          $('[data-dropdown="'+$(this).attr('id')+'"]').trigger('click');
        }
      });
    });

    return app;
  });
