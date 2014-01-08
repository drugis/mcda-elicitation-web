'use strict';
define([ 'angular' ], function(angular) {
	var ErrorHandling = function($q) {
		return {
			'responseError' : function(rejection) {
				console.log("foo");
				return $q.reject(rejection);
			}
		};
	};

	return angular.module('elicit.errorHandling', []).factory(
			'ErrorHandling', ErrorHandling);
});