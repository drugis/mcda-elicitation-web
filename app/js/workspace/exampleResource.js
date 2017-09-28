  define(['angular'], function() {
    return function($resource) {
      return $resource('examples/:url', {
        url: '@url'
      });
    };
  });