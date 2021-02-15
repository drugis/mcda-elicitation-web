'use strict';
define(['lodash', 'angular'], function (_) {
  var dependencies = ['$http', '$q', '$rootScope', 'PataviService'];
  var PataviResultsService = function ($http, $q, $rootScope, PataviService) {
    function postAndHandleResults(problem, successHandler) {
      problem.seed = 1234; //FIXME
      return $http
        .post('/patavi', problem)
        .then(function (result) {
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
        .then(successHandler || defaultSuccessHandler, errorHandler)
        .catch(errorHandler);
    }

    function errorHandler(pataviError) {
      $rootScope.$broadcast('error', {
        type: 'PATAVI',
        message: pataviError.cause
      });
      return $q.reject(pataviError);
    }

    function defaultSuccessHandler(result) {
      return result;
    }

    return {
      postAndHandleResults
    };
  };
  return dependencies.concat(PataviResultsService);
});
