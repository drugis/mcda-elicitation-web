'use strict';
define([], function() {
  var dependencies = ['UserResource'];
  var NavbarDirective = function(UserResource) {
    return {
      restrict: 'E',
      templateUrl: 'app/js/navbar/navbarDirective.html',
      link: function(scope) {
        scope.user = UserResource.get(function(userResult) {
          scope.user.imageUrl = 'https://secure.gravatar.com/avatar/' + userResult.md5Hash + '?s=43&d=mm';
        });
      }
    };
  };
  return dependencies.concat(NavbarDirective);
});
