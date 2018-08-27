'use strict';

define(['mcda/navbar/userResource',
'mcda/navbar/navbarDirective', 
'angular', 'angular-resource'], function(
  UserResource,
  navbarDirective,
  angular
) {
  return angular.module('elicit.navbar', ['ngResource'])
    .factory('UserResource', UserResource)
    .directive('navbarDirective', navbarDirective);
});
