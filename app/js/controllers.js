'use strict';
define([
  'angular',
  'underscore',
  'controllers/chooseProblem',
  'controllers/workspace',
  'controllers/overview',
  'controllers/scaleRange',
  'controllers/partialValueFunction',
  'controllers/ordinalSwing',
  'controllers/intervalSwing',
  'controllers/exactSwing',
  'controllers/results'], function(
    angular, _,
    ChooseProblemController,
    WorkspaceController,
    OverviewController,
    ScaleRangeController,
    PartialValueFunctionController,
    OrdinalSwingController,
    IntervalSwingController,
    ExactSwingController,
    ResultsController) {
    return angular.module('elicit.controllers', [])
          .controller('ChooseProblemController', ChooseProblemController)
          .controller('WorkspaceController', WorkspaceController)
          .controller('OverviewController', OverviewController)
          .controller('ScaleRangeController', ScaleRangeController)
          .controller('PartialValueFunctionController', PartialValueFunctionController)
          .controller('OrdinalSwingController', OrdinalSwingController)
          .controller('IntervalSwingController', IntervalSwingController)
          .controller('ExactSwingController', ExactSwingController)
          .controller('ResultsController', ResultsController);
});
