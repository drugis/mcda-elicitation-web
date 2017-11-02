'use strict';
var requires = [
  'mcda/navbar/userResource',
  'mcda/navbar/navbarDirective'
];
define(['angular', 'angular-resource'].concat(requires), function(
  angular,
  ngResource,
  UserResource,
  navbarDirective
) {
  return angular.module('elicit.navbar', ['ngResource'])
    .factory('UserResource', UserResource)
    .directive('navbarDirective', navbarDirective);
});