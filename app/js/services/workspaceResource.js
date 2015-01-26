define(['angular', 'underscore'], function(angular, _) {
  var dependencies = ['ngResource'];

  var WorkspaceResource = function($q, $resource, MCDAPataviService) {

    var valueTree =  function(problem) {
      return {
        'title': 'Overall value',
        'criteria': _.keys(problem.criteria)
      };
    };

    var createWorkspace = function(problem) {
      return WorkspaceResource.save(workspace);
    };

    var prepareScales = function(problem) {
      var payload = _.extend(problem, {
        method: 'scales'
      });
      return MCDAPataviService.run(payload);
    };


    var addDerived = function(response) {
      var deferred = $q.defer();
      var resource = response.resource;

      prepareScales(resource.problem).then(function(results) {
        /* The $$ properties are reserved for Angular's internal functionality.
           They get stripped when calling toJson (or resource.$save)
           We (ab)use this feature to store derived values in the resource
         */
        resource.$$valueTree = resource.problem.valueTree || valueTree(resource.problem);
        resource.$$scales = results.results;
        deferred.resolve(resource);
      });

      return deferred.promise;
    };

    var resource = $resource(
      config.workspacesRepositoryUrl + ':workspaceId', { workspaceId: '@id' }, {
        get:    { method:'GET', interceptor: { response: addDerived }},
        save:   { method:'POST', interceptor: { response: addDerived }},
        create: { method:'POST', transformRequest: function(problem, headersGetter) {
          return angular.toJson({
            title: problem.title,
            problem: problem
          });
        }}
      }
    );

    return resource;
  };

  return angular.module('elicit.workspaceResource', dependencies).factory('WorkspaceResource', WorkspaceResource);
});
