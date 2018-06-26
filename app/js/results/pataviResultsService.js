'use strict';
define('angular', function() {
  var dependencies = ['$http', '$rootScope', 'PataviService'];
  var PataviResultsService = function($http, $rootScope, PataviService) {
    
    function postAndHandleResults(problem, successHandler, updateHandler) {
      return $http.post('/patavi', problem).then(function(result) {
        var uri = result.headers('Location');
        if (result.status === 201 && uri) {
          return uri;
        }
      }, function(error) {
        $rootScope.$broadcast('error', {
          type: 'BACK_END_ERROR',
          code: error.code || undefined,
          message: 'unable to submit the problem to the server'
        });
      })
      .then(PataviService.listen)
      .then(successHandler || defaultSuccessHandler, errorHandler, updateHandler);
    }

    function errorHandler(pataviError) {
      $rootScope.$broadcast('error', {
        type: 'PATAVI',
        message: pataviError.desc
      });
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
