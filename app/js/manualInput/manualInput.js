'use strict';
define(function(require) {
  var angular = require('angular');
  return angular.module('elicit.manualInput', [])

    .controller('ManualInputController', require('mcda/manualInput/manualInputController'))
    .controller('AddCriterionController', require('mcda/manualInput/addCriterionController'))

    .factory('ManualInputService', require('mcda/manualInput/manualInputService'))

    .directive('effectInput', require('mcda/manualInput/effectInputDirective'))
    .directive('effectInputHelper', require('mcda/manualInput/effectInputHelperDirective'))
    ;

  });
