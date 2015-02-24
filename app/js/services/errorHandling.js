define(function(require) {
  var angular = require("angular");

	var ErrorHandling = function($q, $rootScope) {
		return {
			'responseError': function(rejection) {
				var data, message;
				if (rejection && rejection.data && rejection.data !== "") {
					data = rejection.data;
					message = {
						code: data.code,
						cause: data.message
					};
				} else {
					message = {
						cause: 'an unknown error occurred'
					};
				}

				$rootScope.$broadcast('error', message);
				return $q.reject(rejection);
			}
		};
	};

	return angular.module('elicit.errorHandling', []).factory('ErrorHandling', ErrorHandling);
});
