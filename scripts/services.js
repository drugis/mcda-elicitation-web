define(['angular'], function(angular) {
  return angular.module('elicit.services', []).
    factory('PreferenceStore', ['$http', '$rootScope', function($http, $rootScope) {
      var Store = {
        url: undefined,
        lastError: {},
        save: function(preferences) {
          var self = this;
          if (this.url) {
            $http.put(this.url, preferences).success(function() {
              $rootScope.$broadcast("PreferenceStore.saved");
            }).error(function(data, status) {
              self.lastError = { severity: 'error', message: "Failed to PUT preferences.", cause: status };
              $rootScope.$broadcast("PreferenceStore.error");
            });
          } else {
            this.lastError = { severity: 'warning', message: "Preference store not configured." };
            $rootScope.$broadcast("PreferenceStore.error");
          }
        }
      };
      return Store;
    }]);
});
