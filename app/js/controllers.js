'use strict';
define(function(require) {
  var angular = require('angular');
    return angular.module('elicit.controllers', [])
          .controller('ChooseProblemController', require('controllers/chooseProblem'))
          .controller('WorkspaceController', require('controllers/workspace'))
          .controller('OverviewController', require('controllers/overview'))
          .controller('ScaleRangeController', require('controllers/scaleRange'))
          .controller('PartialValueFunctionController', require('controllers/partialValueFunction'))
          .controller('OrdinalSwingController', require('controllers/ordinalSwing'))
          .controller('IntervalSwingController', require('controllers/intervalSwing'))
          .controller('ExactSwingController', require('controllers/exactSwing'))
          .controller('ResultsController', require('controllers/results'));
});
