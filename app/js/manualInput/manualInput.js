'use strict';
define([
  './inProgressResource',
  './ManualInputWrapper',
  './manualInputController',
  'angular',
  'react2angular'
], function (
  InProgressResource,
  ManualInput,
  ManualInputController,
  angular,
  react2angular
) {
  return angular
    .module('elicit.manualInput', [])
    .controller('ManualInputController', ManualInputController)
    .service('InProgressResource', InProgressResource)
    .component(
      'manualInput',
      react2angular.react2angular(ManualInput.default, [])
    );
});
