'use strict';
define(function(require) {
  var angular = require("angular");
  var ab = require("mcda/lib/autobahn");

  var dependencies = [];
  var PataviService = function($q) {
    var config = window.patavi || {};
    var WS_URI = typeof config['WS_URI'] !== 'undefined' ? config['WS_URI'] : "ws://localhost:3000/ws";
    var BASE_URI = 'http://api.patavi.com/';

    var Task = function(payload) {
      var resultsPromise = $q.defer();
      var self = this;
      this.results = resultsPromise.promise;

      ab.connect(WS_URI, function(session) {
        console.log('Connected to ' + WS_URI, session.sessionid());
        // Subscribe to updates
        session.subscribe(BASE_URI + 'status#', function(topic, event) {
          resultsPromise.notify(event);
        });

        // Send-off RPC
        self.results = session.call(BASE_URI + 'rpc#', 'smaa_v2', payload).then(
          function(result) {
            resultsPromise.resolve(result);
            session.close();
          },
          function(reason, code) {
            console.log('error', code, reason);
            resultsPromise.reject(reason);
            session.close();
          }
        );

      }, function(code, reason) {
        resultsPromise.reject(reason);
        console.log(code, reason);
      });
    };

    var run = function(payload) {
      return new Task(payload).results;
    };

    return {
      run: run
    };

  };
  return angular.module('elicit.pataviService', dependencies).factory('MCDAPataviService', PataviService);
});
