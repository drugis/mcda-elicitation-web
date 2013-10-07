define(['angular', 'underscore'], function(angular, _) {
  return angular.module('elicit.workspace', []).factory('Workspace', function() {
    var workspaces = [];

    var create = function(problem) {
      var workspace = { "problem" : problem };
      workspaces.push(workspace);
      return workspace;
    };

    return { "create" : create };
  });
});
