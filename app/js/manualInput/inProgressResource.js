'use strict';
define(['angular'], function() {
  var dependencies = ['$resource'];
  var InProgressResource = function($resource) {
    return $resource('/inProgress/:inProgressId', {
        inProgressId: '@inProgressId'
      }, {
        put:{
          method: 'PUT'
        }
      }
    );
  };

  return dependencies.concat(InProgressResource);
});