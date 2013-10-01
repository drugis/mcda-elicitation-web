define(['angular',
    'elicit/decision-problems',
    'components',
    'services'],
function(angular) {
  var app = angular.module('elicit', ['elicit.example', 'elicit.components', 'elicit.services']);

  // Add string HashCode
  String.prototype.hashCode = function(){
    var hash = 0;
    if (this.length == 0) return hash;
    for (var i = 0; i < this.length; i++) {
      var character = this.charCodeAt(i);
      hash = ((hash<<5)-hash)+character;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

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
