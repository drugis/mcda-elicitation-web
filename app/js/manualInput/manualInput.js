'use strict';
define(['../manualInput/ManualInput', 'react2angular', 'angular'], function (
  ManualInput,
  react2angular,
  angular
) {
  return angular
    .module('elicit.manualInput', [])
    .component('manualInput', react2angular.react2angular(ManualInput, []));
});
