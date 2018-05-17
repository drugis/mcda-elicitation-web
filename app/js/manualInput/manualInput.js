'use strict';
var requires = [
  'mcda/manualInput/manualInputController',
  'mcda/manualInput/addCriterionController',
  'mcda/manualInput/addDataSourceController',
  'mcda/manualInput/manualInputService',
  'mcda/manualInput/inputKnowledgeService',
  'mcda/manualInput/constraintService',
  'mcda/manualInput/performanceService',
  'mcda/manualInput/effectInputHelperDirective',
  'mcda/manualInput/inputDataSourceDirective',
  'mcda/manualInput/inProgressResource', 
  'angular-resource'
];
define(['angular'].concat(requires), function(
  angular,
  ManualInputController,
  AddCriterionController,
  AddDataSourceController,
  ManualInputService,
  InputKnowledgeService,
  ConstraintService,
  PerformanceService,
  effectInputHelper,
  inputDataSource,
  InProgressResource
) {
  return angular.module('elicit.manualInput', ['ngResource', 'elicit.util'])

    .controller('ManualInputController', ManualInputController)
    .controller('AddCriterionController', AddCriterionController)
    .controller('AddDataSourceController', AddDataSourceController)

    .factory('ManualInputService', ManualInputService)
    .factory('InputKnowledgeService', InputKnowledgeService)
    .factory('ConstraintService', ConstraintService)
    .factory('PerformanceService', PerformanceService)

    .directive('effectInputHelper', effectInputHelper)
    .directive('inputDataSource', inputDataSource)

    .service('InProgressResource', InProgressResource);

});
