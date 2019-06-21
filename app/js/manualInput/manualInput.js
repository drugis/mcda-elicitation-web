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
  './toStringService',
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
  ToStringService,
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
      .factory('ToStringService', ToStringService)

      .directive('effectInputHelper', effectInputHelper)
      .directive('inputDataSource', inputDataSource)
      .directive('manualInputTable', manualInputTable)

      .service('InProgressResource', InProgressResource);

  });
