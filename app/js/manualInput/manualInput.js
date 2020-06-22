'use strict';
define([
  './inProgressResource',
  './inProgressResource2',
  './ManualInputWrapper',
  './manualInputController',
  'angular',
  'react2angular'
], function (
  InProgressResource,
  InProgressResource2,
  ManualInput,
  ManualInputController,
  angular,
  react2angular
) {
  return angular
    .module('elicit.manualInput', [])
    .controller('ManualInputController', ManualInputController)
    .service('InProgressResource', InProgressResource)
    .service('InProgressResource2', InProgressResource2)
    .component(
      'manualInput',
      react2angular.react2angular(ManualInput.default, [])
    );
});
