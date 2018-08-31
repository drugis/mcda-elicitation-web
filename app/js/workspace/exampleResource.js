'use strict';
define(['angular'], function() {
  return ['$resource', function($resource) {
    return $resource('examples/:url', {
      url: '@url'
    });
  }];
});
