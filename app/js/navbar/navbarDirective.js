'use strict';
define([], function() {
  var dependencies = ['$cookies'];
  var NavbarDirective = function($cookies) {
    return {
      restrict: 'E',
      templateUrl: './navbarDirective.html',
      link: function(scope) {
        scope.user = JSON.parse($cookies.get('LOGGED-IN-USER'));
        scope.user.name = scope.user.firstname + ' ' + scope.user.lastname;
        scope.logout = function() {
          $cookies.remove('LOGGED-IN-USER');
        };
      }
    };
  };
  return dependencies.concat(NavbarDirective);
});
