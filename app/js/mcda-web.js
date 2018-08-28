'use strict';
define([
  'angular',
  './config',
  'angular-touch',
  'angular-ui-router',
  'angular-resource',
  'angular-cookies',
  'angularjs-slider',
  'angular-patavi-client',
  'core-js',
  'error-reporting',
  'export-directive',
  'help-popup',
  'jquery',
  'lodash',
  'angular-foundation-6',
  './benefitRisk/benefitRisk',
  './effectsTable/effectsTable',
  './evidence/evidence',
  './services/routeFactory',
  './services/workspaceResource',
  './services/scenarioResource',
  './services/taskDependencies',
  './services/util',
  './results/results',
  './manualInput/manualInput',
  './subProblem/subProblemResource',
  './subProblem/subProblem',
  './workspace/orderingResource',
  './workspace/workspace',
  './workspace/workspaceSettingsResource',
  './directives',
  './navbar/navbar',
  './preferences/preferences',
  'page-title-service'
],
  function(angular, Config) {

    var dependencies = [
      'ngResource',
      'ui.router',
      'mm.foundation',
      'patavi',
      'help-directive',
      'elicit.benefitRisk',
      'elicit.directives',
      'elicit.effectsTable',
      'elicit.evidence',
      'elicit.manualInput',
      'elicit.navbar',
      'elicit.preferences',
      'elicit.results',
      'elicit.routeFactory',
      'elicit.scenarioResource',
      'elicit.subProblem',
      'elicit.subProblemResource',
      'elicit.taskDependencies',
      'elicit.util',
      'elicit.workspace',
      'elicit.workspaceResource',
      'elicit.orderingResource',
      'elicit.workspaceSettingsResource',
      'ngCookies',
      'errorReporting',
      'export-directive',
      'page-title-service'
    ];

    var app = angular.module('elicit', dependencies);
    app.run(['$rootScope', '$http', 'HelpPopupService', 'PageTitleService',
      function($rootScope, $http, HelpPopupService, PageTitleService) {
        $rootScope.$safeApply = function($scope, fn) {
          var phase = $scope.$root.$$phase;
          if (phase === '$apply' || phase === '$digest') {
            this.$eval(fn);
          } else {
            this.$apply(fn);
          }
        };
        HelpPopupService.loadLexicon($http.get('lexicon.json'));
        PageTitleService.loadLexicon($http.get('mcda-page-titles.json'));
      }]);

    app.constant('Tasks', Config.tasks);
    app.constant('isMcdaStandalone', true);
    app.constant('currentSchemaVersion', '1.1.0');

    app.config(function($stateProvider, $urlRouterProvider, MCDARouteProvider) {
      var baseTemplatePath = './../views/';

      //ui-router code starts here
      $stateProvider.state('workspace', {
        url: '/workspaces/:workspaceId',
        templateUrl: './workspace/workspace.html',
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
          templateUrl: './workspace/chooseProblem.html',
          controller: 'ChooseProblemController'
        })
        .state('manualInput', {
          url: '/manual-input',
          templateUrl: './manualInput/manualInput.html',
          controller: 'ManualInputController',
          params: {
            workspace: null
          }
        })
        .state('manualInputInProgress', {
          url: '/manual-input/:inProgressId',
          templateUrl:  + './manualInput/manualInput.html',
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
