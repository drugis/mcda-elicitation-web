define(['angular', 'angular-resource'], function(angular, angularResource) {
return angular.module('elicit.example', ['ngResource']).factory('DecisionProblem', function($resource, $q) {
  var repositoryUrl = config ? config.examplesRepository : '';
  var resource = $resource(repositoryUrl + ':url', {url:'@url'});
  var problem = $q.defer();
  var Problem = {
    problem: problem.promise,
    populateWithUrl: function(url) {
      var self = this;
      resource.get({url: url}, function(data) {
        self.populateWithData(data);
      });
    },
    populateWithData: function(data) {
      problem.resolve(data);
    },
    list: function(callback) {
      return resource.query(callback);
    }
  };
  return Problem;
});
});
