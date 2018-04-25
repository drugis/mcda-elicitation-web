'use strict';
var requires = [
  'mcda/manualInput/manualInputController',
  'mcda/manualInput/addCriterionController',
  'mcda/manualInput/manualInputService',
  'mcda/manualInput/constraintService',
  'mcda/manualInput/performanceService',
  'mcda/manualInput/effectInputHelperDirective',
  'mcda/manualInput/inProgressResource'
];
define(['angular', 'angular-resource'].concat(requires), function(
  angular,
  ngResource, // needed for .directive
  ManualInputController,
  AddCriterionController,
  ManualInputService,
  ConstraintService,
  PerformanceService,
  effectInputHelper,
  InProgressResource
) {
  return angular.module('elicit.manualInput', ['ngResource', 'elicit.util'])

    .controller('ManualInputController', ManualInputController)
    .controller('AddCriterionController', AddCriterionController)

    .factory('ManualInputService', ManualInputService)
    .factory('ConstraintService', ConstraintService)
    .factory('PerformanceService', PerformanceService)
    
    .directive('effectInputHelper', effectInputHelper)

    .service('InProgressResource', InProgressResource);

});