define(
  ['angular',
   'require',
   'underscore',
   'config',
   'services/decisionProblem',
   'services/workspace',
   'controllers',
   'components'],
  function(angular, require, _, Config) {
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
      $rootScope.$on('patavi.error', function(e, message) {
        $rootScope.$safeApply($rootScope, function() {
          $rootScope.error = message;
        });
      });
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

    // example url: /#/workspaces/<id>/<taskname>
    app.config(['Tasks', '$routeProvider', function(Tasks, $routeProvider) {
      _.each(Tasks.available, function(task) {
        var baseTemplatePath = "app/views/";
        var templateUrl = baseTemplatePath + task.templateUrl;
        $routeProvider
          .when('/workspaces/:workspaceId/' + task.id, { templateUrl: templateUrl, controller: task.controller });
      });
      $routeProvider.otherwise({redirectTo: 'workspaces/new/choose-problem'});
    }]);

    return app;
  });
