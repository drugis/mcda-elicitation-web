'use strict';
define(['angular'], function () {
  var dependencies = [
    '$http',
    '$q',
    '$rootScope',
    'PataviService',
    'WorkspaceSettingsService'
  ];
  var PataviResultsService = function (
    $http,
    $q,
    $rootScope,
    PataviService,
    WorkspaceSettingsService
  ) {
    function getWeights(problem, scenario) {
      const newProblem = {
        ..._.cloneDeep(problem),
        method: 'representativeWeights',
        seed: WorkspaceSettingsService.getRandomSeed()
      };
      return $http
        .post('/patavi/weights', {problem: newProblem, scenario: scenario})
        .then((result) => {
          return result.data;
        }, errorHandler)
        .catch(errorHandler);
    }

    function postAndHandleResults(problem, successHandler) {
      problem.seed = WorkspaceSettingsService.getRandomSeed();
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
      postAndHandleResults,
      getWeights
    };
  };
  return dependencies.concat(PataviResultsService);
});
