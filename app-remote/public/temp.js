'use strict';
define(
  ['angular',
   'angular-resource',
   'angular-ui-router'],
  function(angular) {
    var app = angular.module("temp", ['ui.router', 'ngResource']);

    app.run(['$rootScope', function($rootScope) {
      $rootScope.$on('error', function(e, message) {
        $rootScope.$safeApply($rootScope, function() {
          $rootScope.error = _.extend(message, { close: function() { delete $rootScope.error; } });
        });
      });
    }]);

    app.config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('');

      $stateProvider.state('root', {
        url: '',
        templateUrl: 'views/home.html',
        resolve: {
          user: function($q, $http) {
            var user = $q.defer();
            $http({method: 'GET', url: '/me'})
              .success(function(data) {
                user.resolve(data);
              })
              .error(function(error) {
                user.resolve(null);
              });
            return user.promise;
          }
        },
        controller: function($scope, $state, user) {
          $scope.user = user;
        }
      });
    });

    return app;
  });
