'use strict';
define(['lodash', 'angular'], function (_, angular) {
  function generateUuid() {
    return function () {
      var pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
      return pattern.replace(/[xy]/g, function (c) {
        /*jslint bitwise: true */
        var r = (Math.random() * 16) | 0;
        var v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };
  }

  function getDataSourcesById() {
    return function (criteria) {
      return _(criteria)
        .flatMap(function (criterion) {
          return criterion.dataSources;
        })
        .keyBy('id')
        .value();
    };
  }

  return angular
    .module('elicit.util', [])
    .factory('generateUuid', generateUuid)
    .factory('getDataSourcesById', getDataSourcesById);
});
