'use strict';
var requires = [
  'mcda/manualInput/manualInputController',
  'mcda/manualInput/addCriterionController',
  'mcda/manualInput/manualInputService',
  'mcda/manualInput/constraintService',
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
  effectInputHelper,
  InProgressResource
) {
  return angular.module('elicit.manualInput', ['ngResource'])

    .controller('ManualInputController', ManualInputController)
    .controller('AddCriterionController', AddCriterionController)

    .factory('ManualInputService', ManualInputService)
    .factory('ConstraintService', ConstraintService)

    .directive('effectInputHelper', effectInputHelper)

    .service('InProgressResource', InProgressResource);

});