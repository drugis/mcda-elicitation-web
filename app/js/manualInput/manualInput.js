'use strict';
define([
  './manualInputController',
  './addCriterionController',
  './addAlternativeController',
  './constraintService',
  '../evidence/editDataSourceController',
  './editUnitOfMeasurementController',
  './editStrengthOfEvidenceController',
  './finishInputCellService',
  './generateDistributionService',
  './inProgressResource',
  './inputKnowledgeService',
  './manualInputService',
  './performanceService',
  './toStringService',
  './effectInputHelperDirective',
  './inputDataSourceDirective',
  './manualInputTableDirective',
  'angular',
  'angular-resource'
], function(
  ManualInputController,
  AddCriterionController,
  AddAlternativeController,
  ConstraintService,
  EditDataSourceController,
  EditUnitOfMeasurementController,
  EditStrengthOfEvidenceController,
  FinishInputCellService,
  GenerateDistributionService,
  InProgressResource,
  InputKnowledgeService,
  ManualInputService,
  PerformanceService,
  ToStringService,
  effectInputHelper,
  inputDataSource,
  manualInputTable,
  angular
) {
    return angular.module('elicit.manualInput', ['ngResource', 'elicit.util', 'elicit.effectsTable'])

      .controller('ManualInputController', ManualInputController)
      .controller('AddCriterionController', AddCriterionController)
      .controller('EditDataSourceController', EditDataSourceController)
      .controller('EditUnitOfMeasurementController', EditUnitOfMeasurementController)
      .controller('EditStrengthOfEvidenceController', EditStrengthOfEvidenceController)
      .controller('AddAlternativeController', AddAlternativeController)

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
