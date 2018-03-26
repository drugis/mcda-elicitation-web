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
    'core-js',
    'error-reporting',
    'export-directive',
    'help-popup',
    'mcda/effectsTable/effectsTable',
    'mcda/evidence/evidence',
    'mcda/services/routeFactory',
    'mcda/services/workspaceResource',
    'mcda/services/scalesService',
    'mcda/services/scenarioResource',
    'mcda/services/taskDependencies',
    'mcda/services/hashCodeService',
    'mcda/services/util',
    'mcda/results/results',
    'mcda/manualInput/manualInput',
    'mcda/subProblem/subProblemResource',
    'mcda/subProblem/subProblem',
    'mcda/workspace/workspace',
    'mcda/workspace/orderingResource',
    'mcda/controllers',
    'mcda/directives',
    'mcda/navbar/navbar',
    'mcda/preferences/preferences',
    'mcda/evidence/toggleColumnsResource'
  ],
  function(angular, require, Config) {

    var dependencies = [
      'ngResource',
      'ui.router',
      'mm.foundation',
      'patavi',
      'help-directive',
      'elicit.controllers',
      'elicit.directives',
      'elicit.effectsTable',
      'elicit.evidence',
      'elicit.manualInput',
      'elicit.navbar',
      'elicit.preferences',
      'elicit.results',
      'elicit.routeFactory',
      'elicit.scalesService',
      'elicit.scenarioResource',
      'elicit.subProblem',
      'elicit.subProblemResource',
      'elicit.taskDependencies',
      'elicit.util',
      'elicit.workspace',
      'elicit.workspaceResource',
      'elicit.orderingResource',
      'elicit.toggleColumnsResource',
      'ngCookies',
      'errorReporting',
      'export-directive'
    ];

    var app = angular.module('elicit', dependencies);
    app.run(['$rootScope', '$http', 'HelpPopupService', function($rootScope, $http, HelpPopupService) {
      $rootScope.$safeApply = function($scope, fn) {
        var phase = $scope.$root.$$phase;
        if (phase === '$apply' || phase === '$digest') {
          this.$eval(fn);
        } else {
          this.$apply(fn);
        }
      };
      HelpPopupService.loadLexicon($http.get('lexicon.json'));
    }]);

    app.constant('Tasks', Config.tasks);

    // Detect our location so we can get the templates from the correct place
    app.constant('mcdaRootPath', (function() {
      return require.toUrl('.').replace('js', '');
    })());

    app.constant('isMcdaStandalone', true);


    app.config(function(mcdaRootPath, $stateProvider, $urlRouterProvider, MCDARouteProvider) {
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
          controller: 'ManualInputController',
          params: {
            workspace: null
          }
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