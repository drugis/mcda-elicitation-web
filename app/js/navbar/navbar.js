'use strict';
define([
  './userResource',
  './navbarDirective',
  'angular', 
  'angular-resource'
], function(
  UserResource,
  navbarDirective,
  angular
) {
    return angular.module('elicit.navbar', ['ngResource'])
      .factory('UserResource', UserResource)
      .directive('navbarDirective', navbarDirective);
  });
