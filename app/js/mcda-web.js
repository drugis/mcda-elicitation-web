'use strict';

const {CURRENT_SCHEMA_VERSION} = require('@shared/constants');

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
  'jquery',
  'lodash',
  'page-title-service',
  './benefitRisk/benefitRisk',
  './deterministicResults/deterministicResults',
  './evidence/evidence',
  './services/routeFactory',
  './services/workspaceResource',
  './services/scenarioResource',
  './services/taskDependencies',
  './util',
  './manualInput/manualInput',
  './smaaResults/smaaResults',
  './subProblem/subProblemResource',
  './subProblem/subProblem',
  './workspace/workspace',
  './navbar/navbar',
  './preferences/preferences'
], function (angular, Config) {
  var dependencies = [
    'ui.router',
    'elicit.benefitRisk',
    'elicit.deterministicResults',
    'elicit.evidence',
    'elicit.manualInput',
    'elicit.navbar',
    'elicit.preferences',
    'elicit.routeFactory',
    'elicit.scenarioResource',
    'elicit.smaaResults',
    'elicit.subProblem',
    'elicit.subProblemResource',
    'elicit.taskDependencies',
    'elicit.util',
    'elicit.workspace',
    'elicit.workspaceResource',
    'errorReporting',
    'export-directive',
    'mm.foundation',
    'ngCookies',
    'ngResource',
    'page-title-service',
    'patavi',
    'rzSlider'
  ];

  var app = angular.module('elicit', dependencies);
  app.run([
    '$http',
    'PageTitleService',
    function ($http, PageTitleService) {
      PageTitleService.loadLexicon($http.get('mcda-page-titles.json'));
    }
  ]);

  app.constant('Tasks', Config.tasks);
  app.constant('isMcdaStandalone', true);
  app.constant('currentSchemaVersion', CURRENT_SCHEMA_VERSION);

  app.config([
    '$stateProvider',
    '$urlRouterProvider',
    'MCDARouteProvider',
    function ($stateProvider, $urlRouterProvider, MCDARouteProvider) {
      $stateProvider.state('workspace', {
        url: '/workspaces/:workspaceId',
        templateUrl: './workspace/workspace.html',
        controller: 'WorkspaceController',
        resolve: {
          currentWorkspace: [
            '$stateParams',
            'WorkspaceResource',
            function ($stateParams, WorkspaceResource) {
              return WorkspaceResource.get($stateParams).$promise;
            }
          ]
        }
      });

      MCDARouteProvider.buildRoutes($stateProvider, 'workspace');

      // Default route
      $stateProvider
        .state('analyses', {
          url: '/choose-problem',
          templateUrl: './workspace/chooseProblem.html',
          controller: 'ChooseProblemController'
        })
        .state('manualInput', {
          url: '/manual-input/:inProgressId',
          templateUrl: './manualInput/manualInput.html',
          controller: 'ManualInputController'
        });
      $urlRouterProvider.otherwise('/choose-problem');
    }
  ]);

  return app;
});
