'use strict';
define(['angular', 'angular-resource'], function(angular, angularResource) {
  return angular.module('elicit.problem-resource', ['ngResource']).factory('DecisionProblem', function($resource, $q) {
    var repositoryUrl = config ? config.examplesRepository : '';
    var resource = $resource(repositoryUrl + ':url', {url:'@url'});
    var problem = $q.defer();
    var problemList = $q.defer();

    resource.query(function(data) {
      problemList.resolve(data);
    });

    return {
      problem: problem.promise,
      list: problemList.promise,
      populateWithUrl: function(url) {
        var self = this;
        resource.get({url: url}, function(data) {
          self.populateWithData(data);
        });
      },
      populateWithData: function(data) {
        problem.resolve(data);
      }
    };
  });
});
