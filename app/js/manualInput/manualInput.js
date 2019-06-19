'use strict';
define([
  './manualInputController',
  './addCriterionController',
  '../evidence/editDataSourceController',
  './manualInputService',
  './inputKnowledgeService',
  './constraintService',
  './performanceService',
  './generateDistributionService',
  './finishInputCellService',
  './effectInputHelperDirective',
  './inputDataSourceDirective',
  './inProgressResource',
  './manualInputTableDirective',
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
  GenerateDistributionService,
  FinishInputCellService,
  effectInputHelper,
  inputDataSource,
  InProgressResource,
  manualInputTable,
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
      .factory('GenerateDistributionService', GenerateDistributionService)
      .factory('FinishInputCellService', FinishInputCellService)

      .directive('effectInputHelper', effectInputHelper)
      .directive('inputDataSource', inputDataSource)
      .directive('manualInputTable', manualInputTable)

      .service('InProgressResource', InProgressResource);

  });
