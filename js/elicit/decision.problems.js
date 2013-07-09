angular.module('elicit.example', ['ngResource']).factory('DecisionProblem', function($resource, $rootScope) {
  var repositoryUrl = config ? config.examplesRepository : '';
  var Problem = {
    url: undefined,
    resource: $resource(repositoryUrl + ':url', {url:'@url'}),
    get: function(callback) {
      if (this.url) {
        return this.resource.get({url: this.url}, callback);
      }
    },
    list: function(callback) {
      return this.resource.query(callback);
    }
  };
  return Problem;
});
