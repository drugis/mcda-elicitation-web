angular.module('elicit.example', ['ngResource']).factory('DecisionProblem', function($resource, $rootScope) {
  var Problem = {
    url: undefined,
    resource: $resource('examples/:url', {url:'@url'}),
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
