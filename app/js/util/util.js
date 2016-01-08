'use strict';

define(function (require) {
  var angular = require('angular');
  var dependencies = ['ngResource'];

  return angular.module('elicit.util', dependencies)

    //resources
    .factory('UserResource', require('mcda/util/userResource'))

    // directive
    .directive('navbarDirective', require('mcda/util/navbarDirective'))

    // controllers

    // interceptors

    // services
    ;
});
