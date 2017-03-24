'use strict';
define(function(require) {
  var angular = require('angular');
  var _ = require('underscore');

  var dependencies = ['$http', 'PataviService'];

  var ScalesService = function($http, PataviService) {
    function getObservedScales(scope, problem) {
      return $http.post('/patavi', _.extend(problem, {
          method: 'scales'
        })).then(function(result) {
          var uri = result.headers('Location');
          if (result.status === 201 && uri) {
            return uri;
          }
        }, function(error) {
          scope.$root.$broadcast('error', {
            type: 'BACK_END_ERROR',
            code: error.code || undefined,
            message: 'unable to submit the problem to the server'
          });
        })
        .then(PataviService.listen)
        .then(
          function(result) {
            return result;
          },
          function(pataviError) {
            scope.$root.$broadcast('error', {
              type: 'PATAVI',
              message: pataviError.desc
            });
          });
    }

    return {
      getObservedScales: getObservedScales
    };
  };

  return angular.module('elicit.scalesService', []).service('ScalesService', dependencies.concat(ScalesService));
});
