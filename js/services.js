angular.module('elicit.services', []).
  factory("Jobs", ['$rootScope', '$http', '$timeout', function($rootScope, $http, $timeout) {
  var getUUID = function(path) {
    var parser = document.createElement('a');
    parser.href = path;
    return parser.pathname.split("/").pop();
  }

  var updateJob = function(job, data) {
    for (var field in data) {
      job[field] = data[field];
    }
    job.uuid = getUUID(job.results);
  }

  var Jobs = {
    jobs: [],
    __polling: false,
    __nonPoll: ["completed", "failed", "canceled"],

    isReady: function() {
      var self = this;
      return (_.filter(this.jobs, function(j) {
        return self.__nonPoll.indexOf(j.data.status) == - 1
      }).length === 0);
    },

    query: function() {
      return this.jobs;
    },

    startPoll: function() {
      var jobs = this.jobs;
      var self = this;
      (function tick() {
        _.each(jobs, function(job) {
          if (self.__nonPoll.indexOf(job.data.status) == - 1) {
            $http.get(job.data.job).success(function(data) {
              updateJob(job.data, data);
            });
          } else {
            if (!job.executed && job.data.status === "completed") {
              $http.get(job.data.results).success(function(data) {
                job.results = data;
                $rootScope.$broadcast(job.broadcast, job);
              });
            }
            job.executed = true;
          }
          $rootScope.$broadcast("jobsChange");
        });
        $timeout(tick, 500);
      })();
    },

    add: function(job) {
      if (!this.__polling) {
        this.startPoll();
        this.__polling = true;
      }
      this.jobs.push(job);
      $rootScope.$broadcast("jobsChange");
      return job;
    },

    get: function(id) {
      return _.find(this.jobs, function(job) {
        return job.id === id;
      });
    },

    cancel: function(id) {
      var job = this.get(id);
      $http({method:'DELETE', url:job.data.job}).success(function(status) {
        updateJob(job, status);
        $rootScope.$broadcast("jobsChange");
      });
    }
  };
  return Jobs;
}]);
