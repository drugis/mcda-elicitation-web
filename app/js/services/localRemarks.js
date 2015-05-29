'use strict';
define(function(require) {
  var angular = require(angular);
  var dependencies = [];

  var Remarks = function ($q) {

    function get(workspaceId) {
      var deferred = $q.defer();
      var remarks = angular.fromJson(localStorage.getItem('remarks.' + workspaceId));
      remarks = remarks ? remarks : {};
      deferred.resolve(remarks);
      return deferred.promise;
    }

    function save(workspaceId, remarks) {
      localStorage.setItem('remarks.' + workspaceId, angular.toJson(remarks));
      return remarks;
    }

    return {
      get: get,
      save: save
    };
  };
  return angular.module('elicit.localRemarks', dependencies).factory('LocalRemarks', Remarks);
});
