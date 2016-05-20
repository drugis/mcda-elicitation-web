'use strict';
define(function(require) {
  var angular = require('angular');
  var _ = require('underscore');

  var dependencies = ['$http', 'PataviService'];

  var WorkspaceService = function($http, PataviService) {
    function getObservedScales(scope, problem) {
      return $http.post('/patavi', _.extend(problem, {method: 'scales'})).then(function(result) {
        var uri = result.headers("Location");
        if (result.status === 201 && uri) {
          return uri.replace(/^https/, "wss") + '/updates'; // FIXME
        }
      }, function(error) {
        scope.$root.$broadcast('error', error);
      })
      .then(PataviService.listen)
      .then(
        function(result) {
          return result.results;
        },
        function(pataviError) {
          scope.$root.$broadcast('error', {
            type: 'patavi',
            message: pataviError.desc
          });
        });
    }

    return {
      getObservedScales: getObservedScales
    };
  };

  return angular.module('elicit.scalesService', []).service('ScalesService', dependencies.concat(WorkspaceService));
});
