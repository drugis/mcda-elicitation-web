'use strict';
define([
  'angular',
  './config',
  'angular-cookies',
  'angular-foundation-6',
  'angular-patavi-client',
  'angular-touch',
  'angular-ui-router',
  'angularjs-slider',
  'core-js',
  'error-reporting',
  'export-directive',
  'help-popup',
  'jquery',
  'lodash',
  'page-title-service',
  './benefitRisk/benefitRisk',
  './effectsTable/effectsTable',
  './evidence/evidence',
  './services/routeFactory',
  './services/workspaceResource',
  './services/scenarioResource',
  './services/taskDependencies',
  './util',
  './results/results',
  './manualInput/manualInput',
  './subProblem/subProblemResource',
  './subProblem/subProblem',
  './workspace/orderingResource',
  './workspace/workspace',
  './workspace/workspaceSettingsResource',
  './directives',
  './navbar/navbar',
  './preferences/preferences'
],
  function(angular, Config) {
    var dependencies = [
      'ui.router',
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
      'errorReporting',
      'export-directive',
      'help-directive',
      'mm.foundation',
      'ngCookies',
      'ngResource',
      'page-title-service',
      'patavi',
      'rzModule'
    ];

    var app = angular.module('elicit', dependencies);
    app.run(['$http', 'HelpPopupService', 'PageTitleService',
      function($http, HelpPopupService, PageTitleService) {
        HelpPopupService.loadLexicon($http.get('lexicon.json'));
        PageTitleService.loadLexicon($http.get('mcda-page-titles.json'));
      }]);

    app.constant('Tasks', Config.tasks);
    app.constant('isMcdaStandalone', true);
    app.constant('currentSchemaVersion', '1.3.4');

    app.config([
      '$stateProvider',
      '$urlRouterProvider',
      'MCDARouteProvider',
      function(
        $stateProvider,
        $urlRouterProvider,
        MCDARouteProvider
      ) {
        $stateProvider.state('workspace', {
          url: '/workspaces/:workspaceId',
          templateUrl: './workspace/workspace.html',
          controller: 'WorkspaceController',
          resolve: {
            currentWorkspace: ['$stateParams', 'WorkspaceResource',
              function($stateParams, WorkspaceResource) {
                return WorkspaceResource.get($stateParams).$promise;
              }],
            workspaceSettings: ['WorkspaceSettingsService', '$stateParams',
              function(WorkspaceSettingsService, $stateParams) {
                return WorkspaceSettingsService.loadWorkspaceSettings($stateParams);
              }]
          }
        });

        MCDARouteProvider.buildRoutes($stateProvider, 'workspace');

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
            templateUrl: './manualInput/manualInput.html',
            controller: 'ManualInputController'
          });
        $urlRouterProvider.otherwise('/choose-problem');
      }]);

    return app;
  });
