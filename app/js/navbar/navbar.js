'use strict';

define(function (require) {
  var angular = require('angular');
  var dependencies = ['ngResource'];

  return angular.module('elicit.navbar', dependencies)

    //resources
    .factory('UserResource', require('mcda/navbar/userResource'))

    // directive
    .directive('navbarDirective', require('mcda/navbar/navbarDirective'))

    // controllers

    // interceptors

    // services
    ;
});
