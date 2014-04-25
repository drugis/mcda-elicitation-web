'use strict';
define(['angular'], function(angular) {
	var ErrorHandling = function($q, $rootScope) {
		return {
			'responseError': function(rejection) {
				var data = rejection.data;
				var message = {
					code: data.code,
					cause: data.message
				};
				$rootScope.$broadcast('error', message);
				return $q.reject(rejection);
			}
		};
	};

	return angular.module('elicit.errorHandling', []).factory(
		'ErrorHandling', ErrorHandling);
});