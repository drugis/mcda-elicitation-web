define(['angular',
    'elicit/decision-problem',
    'elicit/controller',
    'components',
    'services'],
function(angular) {
  var app = angular.module('elicit', 
  ['elicit.controller', 'elicit.problem-resource', 'elicit.components', 'elicit.services']);

  app.run(['$rootScope', function($rootScope) {
    $rootScope.$safeApply = function($scope, fn) {
      var phase = $scope.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        this.$eval(fn);
      }
      else {
        this.$apply(fn);
      }
    };

  }]);

  return app;
});
