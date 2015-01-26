'use strict';
define(
  ['angular',
    'require',
    'underscore',
    'jQuery',
    'mcda/config',
    'foundation',
    'mmfoundation',
    'angular-ui-router',
    'angularanimate',
    'mcda/services/workspaceService',
    'mcda/services/remarks',
    'mcda/services/routeFactory',
    'mcda/services/workspaceResource',
    'mcda/services/scenarioResource',
    'mcda/services/taskDependencies',
    'mcda/services/errorHandling',
    'mcda/services/hashCodeService',
    'mcda/services/pataviService',
    'mcda/services/partialValueFunction',
    'mcda/services/util',
    'mcda/services/scaleRangeService',
    'mcda/controllers',
    'mcda/directives'
  ],
  function(angular, require, _, $, Config) {
    var dependencies = [
      'ui.router',
      'mm.foundation',
      'ngAnimate',
      'elicit.workspaceService',
      'elicit.scaleRangeService',
      'elicit.remarks',
      'elicit.workspaceResource',
      'elicit.scenarioResource',
      'elicit.util',
      'elicit.directives',
      'elicit.pataviService',
      'elicit.controllers',
      'elicit.taskDependencies',
      'elicit.errorHandling',
      'elicit.routeFactory',
      'elicit.pvfService'
    ];
    var app = angular.module('elicit', dependencies);

    app.run(['$rootScope', '$window', '$http',
      function($rootScope, $window, $http) {
        var csrfToken = $window.config._csrf_token;
        var csrfHeader = $window.config._csrf_header;

        $http.defaults.headers.common[csrfHeader] = csrfToken;

        $rootScope.$on('$viewContentLoaded', function() {
          $(document).foundation();
        });

        // from http://stackoverflow.com/questions/16952244/what-is-the-best-way-to-close-a-dropdown-in-zurb-foundation-4-when-clicking-on-a
        $('.f-dropdown').click(function() {
          if ($(this).hasClass('open')) {
            $('[data-dropdown="' + $(this).attr('id') + '"]').trigger('click');
          }
        });

        $rootScope.$safeApply = function($scope, fn) {
          var phase = $scope.$root.$$phase;
          if (phase === '$apply' || phase === '$digest') {
            this.$eval(fn);
          } else {
            this.$apply(fn);
          }
        };
        $rootScope.$on('error', function(e, message) {
          $rootScope.$safeApply($rootScope, function() {
            $rootScope.error = _.extend(message, {
              close: function() {
                delete $rootScope.error;
              }
            });
          });
        });

      }
    ]);
    app.constant('Tasks', Config.tasks);

    // Detect our location so we can get the templates from the correct place
    app.constant('mcdaRootPath', (function() {
      var scripts = document.getElementsByTagName('script');
      var pattern = /js\/mcda-web.js$/;
      for (var i = 0; i < scripts.length; ++i) {
        if ((scripts[i].src || '').match(pattern)) {
          return scripts[i].src.replace(pattern, '');
        }
      }
      throw 'Failed to detect location for mcda-web.';
    })());


    app.config(['mcdaRootPath', 'Tasks', '$stateProvider', '$urlRouterProvider', '$httpProvider', 'MCDARouteProvider', '$animateProvider',
      function(basePath, Tasks, $stateProvider, $urlRouterProvider, $httpProvider, MCDARouteProvider, $animateProvider) {
        var baseTemplatePath = basePath + 'views/';

        $httpProvider.interceptors.push('ErrorHandling');

        // only animate sidepanel
        $animateProvider.classNameFilter(/sidepanel/);

        //ui-router code starts here
        $stateProvider.state('workspace', {
          url: '/workspaces/:workspaceId',
          templateUrl: baseTemplatePath + 'workspace.html',
          controller: 'WorkspaceController',
          resolve: {
            currentWorkspace: ['$stateParams', 'WorkspaceService',
              function($stateParams, WorkspaceService) {
                return WorkspaceService.getWorkspace($stateParams);
              }
            ]
          }
        });

        MCDARouteProvider.buildRoutes($stateProvider, 'workspace', baseTemplatePath);

        // Default route
        $stateProvider.state('choose-problem', {
          url: '/choose-problem',
          templateUrl: baseTemplatePath + 'chooseProblem.html',
          controller: 'ChooseProblemController'
        });

        $urlRouterProvider.otherwise('/choose-problem');
      }
    ]);

    return app;
  });
