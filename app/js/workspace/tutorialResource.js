'use strict';
define(['angular'], function() {
  return ['$resource', function($resource) {
    return $resource('tutorials/:url', {
      url: '@url'
    });
  }];
});
