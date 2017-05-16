'use strict';
define(function(require) {
  var angular = require('angular');
  var Config = require('mcda/config');

  require('mmfoundation');
  require('angular-ui-router');
  require('angular-resource');
  require('angular-cookies');
  require('angular-patavi-client');
  require('error-reporting');
  require('mcda/services/remarks');
  require('mcda/services/routeFactory');
  require('mcda/services/workspaceResource');
  require('mcda/services/workspaceService');
  require('mcda/services/scalesService');
  require('mcda/services/scenarioResource');
  require('mcda/services/subProblemResource');
  require('mcda/services/taskDependencies');
  require('mcda/services/hashCodeService');
  require('mcda/services/effectsTableService');
  require('mcda/services/effectsTableResource');
  require('mcda/services/resultsService');
  require('mcda/services/partialValueFunction');
  require('mcda/services/util');
  require('mcda/services/scaleRangeService');
  require('mcda/manualInput/manualInput');
  require('mcda/subProblem/subProblem');
  require('mcda/controllers');
  require('mcda/directives');
  require('mcda/navbar/navbar');

  var dependencies = [
    'ngResource',
    'ui.router',
    'mm.foundation',
    'patavi',
    'elicit.scaleRangeService',
    'elicit.remarks',
    'elicit.workspaceResource',
    'elicit.workspaceService',
    'elicit.scalesService',
    'elicit.scenarioResource',
    'elicit.subProblemResource',
    'elicit.util',
    'elicit.directives',
    'elicit.effectsTableService',
    'elicit.effectsTableResource',
    'elicit.resultsService',
    'elicit.controllers',
    'elicit.taskDependencies',
    'elicit.routeFactory',
    'elicit.pvfService',
    'elicit.navbar',
    'elicit.manualInput',
    'elicit.subProblem',
    'ngCookies',
    'errorReporting'
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
