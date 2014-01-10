'use strict';
define([ 'angular' ], function(angular) {
	var ErrorHandling = function($q, $window) {
		return {
			'responseError' : function(rejection) {
				$window.location = '/mcda-web/error/' + rejection.status;
				return $q.reject(rejection);
			}
		};
	};

	return angular.module('elicit.errorHandling', []).factory(
			'ErrorHandling', ErrorHandling);
});