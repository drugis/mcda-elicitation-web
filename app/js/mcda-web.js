'use strict';
define(['angular',
    'require',
    'mcda/config',
    'jQuery',
    'lodash',
    'angular-touch',
    'mmfoundation',
    'angular-ui-router',
    'angular-resource',
    'angular-cookies',
    'angularjs-slider',
    'angular-patavi-client',
    'error-reporting',
    'export-directive',
    'mcda/evidence/evidence',
    'mcda/services/routeFactory',
    'mcda/services/workspaceResource',
    'mcda/services/workspaceService',
    'mcda/services/scalesService',
    'mcda/services/scenarioResource',
    'mcda/services/taskDependencies',
    'mcda/services/hashCodeService',
    'mcda/services/effectsTableService',
    'mcda/services/util',
    'mcda/results/results',
    'mcda/preferences/partialValueFunctionService',
    'mcda/manualInput/manualInput',
    'mcda/subProblem/subProblemResource',
    'mcda/subProblem/subProblem',
    'mcda/workspace/workspace',
    'mcda/controllers',
    'mcda/directives',
    'mcda/navbar/navbar',
    'mcda/preferences/preferences'
  ],
  function(angular, require, Config) {

    var dependencies = [
      'ngResource',
      'ui.router',
      'mm.foundation',
      'patavi',
      'elicit.workspaceResource',
      'elicit.workspaceService',
      'elicit.scalesService',
      'elicit.scenarioResource',
      'elicit.subProblemResource',
      'elicit.util',
      'elicit.directives',
      'elicit.effectsTableService',
      'elicit.evidence',
      'elicit.results',
      'elicit.controllers',
      'elicit.taskDependencies',
      'elicit.routeFactory',
      'elicit.pvfService',
      'elicit.navbar',
      'elicit.manualInput',
      'elicit.subProblem',
      'elicit.workspace',
      'ngCookies',
      'errorReporting',
      'export-directive',
      'elicit.preferences'
    ];

    var app = angular.module('elicit', dependencies);
    app.run(['$rootScope',
      function($rootScope) {
        $rootScope.$safeApply = function($scope, fn) {
          var phase = $scope.$root.$$phase;
          if (phase === '$apply' || phase === '$digest') {
            this.$eval(fn);
          } else {
            this.$apply(fn);
          }
        };
      }
    ]);

    app.constant('Tasks', Config.tasks);

    // Detect our location so we can get the templates from the correct place
    app.constant('mcdaRootPath', (function() {
      return require.toUrl('.').replace('js', '');
    })());

    app.config(function(mcdaRootPath, $stateProvider, $urlRouterProvider, $httpProvider, MCDARouteProvider) {
      var baseTemplatePath = mcdaRootPath + 'views/';

      //ui-router code starts here
      $stateProvider.state('workspace', {
        url: '/workspaces/:workspaceId',
        templateUrl: baseTemplatePath + 'workspace.html',
        controller: 'WorkspaceController',
        resolve: {
          currentWorkspace: function($stateParams, WorkspaceResource) {
            return WorkspaceResource.get($stateParams).$promise;
          }
        }
      });

      MCDARouteProvider.buildRoutes($stateProvider, 'workspace', baseTemplatePath);

      // Default route
      $stateProvider
        .state('choose-problem', {
          url: '/choose-problem',
          templateUrl: baseTemplatePath + 'chooseProblem.html',
          controller: 'ChooseProblemController'
        })
        .state('manualInput', {
          url: '/manual-input',
          templateUrl: mcdaRootPath + 'js/manualInput/manualInput.html',
          controller: 'ManualInputController'
        })
        .state('manualInputInProgress', {
          url: '/manual-input/:inProgressId',
          templateUrl: mcdaRootPath + 'js/manualInput/manualInput.html',
          controller: 'ManualInputController'
        });
      $urlRouterProvider.otherwise('/choose-problem');
    });

    app.run(function($rootScope) {
      $rootScope.$safeApply = function($scope, fn) {
        var phase = $scope.$root.$$phase;
        if (phase === '$apply' || phase === '$digest') {
          this.$eval(fn);
        } else {
          this.$apply(fn);
        }
      };

    });

    return app;
  });