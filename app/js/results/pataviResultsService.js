'use strict';
define(['angular'], function() {
  var dependencies = [
    '$http',
    '$q',
    '$rootScope',
    'PataviService',
    'WorkspaceSettingsService'
  ];
  var PataviResultsService = function(
    $http,
    $q,
    $rootScope,
    PataviService,
    WorkspaceSettingsService
  ) {
    function postAndHandleResults(problem, successHandler, updateHandler) {
      problem.seed = WorkspaceSettingsService.getRandomSeed();
      return $http.post('/patavi', problem)
        .then(function(result) {
          var uri = result.headers('Location');
          if (result.status === 201 && uri) {
            return uri;
          } else {
            throw {
              message: 'unknown response from patavi server',
              code: 500
            };
          }
        })
        .then(PataviService.listen)
        .then(successHandler || defaultSuccessHandler, errorHandler, updateHandler)
        .catch(errorHandler);
    }

    function errorHandler(pataviError) {
      $rootScope.$broadcast('error', {
        type: 'PATAVI',
        message: pataviError.cause
      });
      return ($q.reject(pataviError));
    }

    function defaultSuccessHandler(result) {
      return result;
    }

    return {
      postAndHandleResults: postAndHandleResults
    };
  };
  return dependencies.concat(PataviResultsService);
});