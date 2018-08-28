'use strict';
define([
  './manualInputController',
  './addCriterionController',
  '../evidence/editDataSourceController',
  './manualInputService',
  './inputKnowledgeService',
  './constraintService',
  './performanceService',
  './effectInputHelperDirective',
  './inputDataSourceDirective',
  './inProgressResource',
  'angular',
  'angular-resource'
], function(
  ManualInputController,
  AddCriterionController,
  EditDataSourceController,
  ManualInputService,
  InputKnowledgeService,
  ConstraintService,
  PerformanceService,
  effectInputHelper,
  inputDataSource,
  InProgressResource,
  angular
) {
    return angular.module('elicit.manualInput', ['ngResource', 'elicit.util', 'elicit.effectsTable'])

      .controller('ManualInputController', ManualInputController)
      .controller('AddCriterionController', AddCriterionController)
      .controller('EditDataSourceController', EditDataSourceController)

      .factory('ManualInputService', ManualInputService)
      .factory('InputKnowledgeService', InputKnowledgeService)
      .factory('ConstraintService', ConstraintService)
      .factory('PerformanceService', PerformanceService)

      .directive('effectInputHelper', effectInputHelper)
      .directive('inputDataSource', inputDataSource)

      .service('InProgressResource', InProgressResource);

  });
