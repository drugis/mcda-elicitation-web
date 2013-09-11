angular.module('elicit.steps', []).
  directive('scaleRangeStep', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: { currentStep: '=', problem: '=' },
    templateUrl: 'scale-range.html'
  };
}).
  directive('ordinalStep', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: { currentStep: '=', problem: '=' },
    templateUrl: 'elicit-ordinal.html'
  };
}).
  directive('chooseMethodStep', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: { currentStep: '=' },
    templateUrl: 'choose-method.html'
  };
}).
  directive('ratioBoundStep', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: { currentStep: '=', problem: '=' },
    templateUrl: 'elicit-ratio-bound.html'
  };
}).
  directive('exactSwingStep', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: { currentStep: '=', problem: '=' },
    templateUrl: 'elicit-exact-swing.html'
  };
}).
  directive('resultsStep', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: { currentStep: '=', problem: '=' },
    templateUrl: 'results-page.html'
  };
}).
  directive('partialValueFunctionStep', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: { currentStep: '=', problem: '=' },
    templateUrl: 'partial-value-function.html'
  };
});
