'use strict';
define(function(require) {
  var angular = require('angular');
  var _ = require('underscore');

  var dependencies = ['elicit.pataviService'];

  var WorkspaceService = function(MCDAPataviService) {

    var buildValueTree = function(problem) {
      return {
        'title': 'Overall value',
        'criteria': _.keys(problem.criteria)
      };
    };

    // var prepareScales = function(problem) {
    //   var payload = _.extend(problem, {
    //     method: 'scales'
    //   });
    //   return MCDAPataviService.run(payload);
    // };

    var buildTheoreticalScales = function(problem) {
      return _.object(_.map(problem.criteria, function(val, key) {
        var scale = val.scale || [null, null];

        scale[0] = _.isNull(scale[0]) ? -Infinity : scale[0];
        scale[1] = _.isNull(scale[1]) ? Infinity : scale[1];

        return [key, scale];
      }));
    };

    // var addDerived = function(response) {
    //   var deferred = $q.defer();
    //   var resource = response.resource;
    //   var problem = resource.problem;

    //   var successHandler = function(results) {
    //     /* The $$ properties are reserved for Angular's internal functionality.
    //      They get stripped when calling toJson (or resource.$save)
    //      We (ab)use this feature to store derived values in the resource
    //      */
    //     resource.$$valueTree = problem.valueTree || valueTree(problem);
    //     resource.$$scales = {
    //       observed: results.results,
    //       theoretical: theoreticalScales(problem)
    //     };
    //     deferred.resolve(resource);
    //   };

    //   var errorHandler = function(code, error) {
    //     var message = {
    //       code: (code && code.desc) ? code.desc : code,
    //       cause: error
    //     };
    //     $rootScope.$broadcast('error', message);

    //     resource.$$valueTree = problem.valueTree || valueTree(problem);
    //     resource.$$scales = {
    //       observed: undefined,
    //       theoretical: theoreticalScales(problem)
    //     };

    //     deferred.resolve(resource);
    //   };


    //   prepareScales(problem).then(successHandler, errorHandler);

    //   return deferred.promise;
    // };

    function getObservedScales(problem) {
      return MCDAPataviService.run(_.extend(problem, {method: 'scales'})).then(function(result){
        console.log('MCDAPataviService.run succes');
        console.log('result = ' + JSON.stringify(result));
        return result.results;
      }, function(code, error){
        console.log('MCDAPataviService.run error');
      });
    }

    return {
      getObservedScales: getObservedScales,
      buildTheoreticalScales: buildTheoreticalScales,
      buildValueTree: buildValueTree
    };
  };

  return angular.module('elicit.workspaceService', dependencies).factory('WorkspaceService', WorkspaceService);
});
