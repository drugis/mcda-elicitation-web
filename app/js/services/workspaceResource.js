define(['angular', 'underscore'], function(angular, _) {
  var dependencies = ['ngResource'];

  var WorkspaceResource = function($q, $resource, $filter, MCDAPataviService) {

    var valueTree =  function(problem) {
      return {
        'title': 'Overall value',
        'criteria': _.keys(problem.criteria)
      };
    };

    var prepareScales = function(problem) {
      var payload = _.extend(problem, {
        method: 'scales'
      });
      return MCDAPataviService.run(payload);
    };

    var theoreticalScales = function(problem) {
      return _.object(_.map(problem.criteria, function(val, key) {
        var scale = val.scale || [null, null];

        // TODO: This should /not/ be nessecary when 1.4.0 lands
        scale[0] = _.isNull(scale[0]) ? '-\u221e' : $filter('number')(scale[0]);
        scale[1] = _.isNull(scale[1]) ? '\u221e' : $filter('number')(scale[1]);

        return [key, scale];
      }));
    };

    var addDerived = function(response) {
      var deferred = $q.defer();
      var resource = response.resource;
      var problem = resource.problem;

      prepareScales(problem).then(function(results) {
        /* The $$ properties are reserved for Angular's internal functionality.
           They get stripped when calling toJson (or resource.$save)
           We (ab)use this feature to store derived values in the resource
         */
        resource.$$valueTree = problem.valueTree || valueTree(problem);
        resource.$$scales =
          { observed: results.results,
            theoretical: theoreticalScales(problem)
          };
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
