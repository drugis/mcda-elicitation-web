'use strict';
define(['angular', 'mcda/services/taskDependencies'], function(angular, TaskDependencies) {
  var service;
  beforeEach(function() {
    var $injector = angular.injector([ 'elicit.taskDependencies' ]);
    service = $injector.get( 'TaskDependencies' );
  });
  describe("TaskDependencies service", function() {
    describe("Dependency description: scale-ranges", function() {

      it("remove() generates a new state with scale ranges removed", function() {
        var def = service.definitions['scale-range'];
        var criteria = {
          'A' : { pvf: { range: [0, 1] }, title: 'Amsterdam' },
          'B' : { pvf: { range: [1, 5] }, title: 'Bremen' }
        };
        var state = { 'problem' : { 'criteria' : criteria, 'alternatives': {} } };

        var stateCopy = angular.copy(state);
        var expected = angular.copy(state);
        delete expected.problem.criteria.A.pvf.range;
        delete expected.problem.criteria.B.pvf.range;

        var newState = def.remove(state);
        expect(newState).toEqual(expected);
        expect(state).toEqual(stateCopy);

        var newState2 = def.remove(newState);
        expect(newState2).toEqual(expected);

        delete newState.problem.criteria.A.pvf;
        delete expected.problem.criteria.A.pvf;
        var newState3 = def.remove(newState);
        expect(newState3).toEqual(expected);
      });
    });
    xdescribe("Dependency description: partial-value-function", function() {
      it("isPresent() checks whether partial value functions are defined in the problem", function() {
        var def = service.definitions['partial-value-function'];
        var criteria = {
          'A' : { 'pvf': { 'range': [0, 1], "type": "linear", "direction": "increasing" } },
          'B' : { 'pvf': { 'range': [0, 1] } }
        };
        var state = { 'problem' : { 'criteria' : criteria } };
        expect(def.isPresent(state)).toBe(false);
        criteria.B.pvf.type = "linear";
        expect(def.isPresent(state)).toBe(false);
        criteria.B.pvf.direction = "decreasing";
        expect(def.isPresent(state)).toBe(true);
        delete state.problem.criteria.A.pvf;
        expect(def.isPresent(state)).toBe(false);
      });
      it("remove() generates a new state with partial value functions removed", function() {
        var def = service.definitions['partial-value-function'];
        var criteria = {
          'A' : { 'pvf': { 'range': [0, 1], "type": "linear", "direction": "increasing" } },
          'B' : { 'pvf': { 'range': [0, 1], "type": "piecewise-linear", "direction": "decreasing", cutoffs: [0.2, 0.8], values: [0.8, 0.5] } }
        };
        var state = { 'problem' : { 'criteria' : criteria, 'alternatives': {} }, 'preferences': {} };

        var expected = angular.copy(state);
        expected.problem.criteria.A.pvf = { 'range' : [0, 1] };
        expected.problem.criteria.B.pvf = { 'range' : [0, 1] };
        var stateCopy = angular.copy(state);

        expect(def.remove(state)).toEqual(expected);
        expect(state).toEqual(stateCopy);

        expect(def.remove(def.remove(state))).toEqual(expected);

        delete expected.problem.criteria.A.pvf;
        delete expected.problem.criteria.B.pvf;
        expect(def.remove(expected)).toEqual(expected);
      });
    });

    xdescribe("Dependency description: criteria-trade-offs", function() {
      it("isPresent() checks whether prefs are present", function() {
        var def = service.definitions['criteria-trade-offs'];
        var state = { 'problem' : {} };
        expect(def.isPresent(state)).toBe(false);
        state.prefs = {};
        expect(def.isPresent(state)).toBe(true);
      });
      it("remove() generates a new state with prefs removed", function() {
        var def = service.definitions['criteria-trade-offs'];
        var state = { 'problem' : {}, 'prefs': [] };
        var stateCopy = angular.copy(state);
        var expected = angular.copy(state);
        delete expected.prefs;
        expect(def.remove(state)).toEqual(expected);
        expect(state).toEqual(stateCopy);
        expect(def.remove(def.remove(state))).toEqual(expected);
      });
    });

    xdescribe("Dependency description: non-ordinal-preferences", function() {
      it("isPresent() checks whether non-ordinal prefs are present", function() {
        var def = service.definitions['non-ordinal-preferences'];
        var state = { 'problem': {}, prefs: [ { "type" : "ordinal" } ] };
        expect(def.isPresent(state)).toBe(false);
        state.prefs.push({"type" : "ratio bound"});
        expect(def.isPresent(state)).toBe(true);
      });
      it("remove() generates a new state with non-ordinal prefs removed", function() {
        var def = service.definitions['non-ordinal-preferences'];
        var state = { 'problem': {}, prefs: [ {"type" : "ratio bound" }, { "type" : "ordinal" } ] };

        var stateCopy = angular.copy(state);
        var expected = angular.copy(state);
        expected.prefs.splice(0, 1);

        expect(def.remove(state)).toEqual(expected);
        expect(state).toEqual(stateCopy);
      });
    });

    xdescribe("Dependency description: complete-criteria-ranking", function() {
      it("isPresent() checks whether ordinal prefs are present (which currently always implies a full ranking)", function() {
        var def = service.definitions['complete-criteria-ranking'];
        var state = { 'problem': {}, prefs: [ { "type" : "ordinal" } ] };
        expect(def.isPresent(state)).toBe(true);
        state.prefs[0].type = "ratio bound";
        expect(def.isPresent(state)).toBe(false);
        state.prefs = [];
        expect(def.isPresent(state)).toBe(false);
      });
      it("remove() generates a new state with ordinal prefs removed", function() {
        var def = service.definitions['complete-criteria-ranking'];
        var state = { 'problem': {}, prefs: [ {"type" : "ratio bound" }, { "type" : "ordinal" } ] };

        var stateCopy = angular.copy(state);
        var expected = angular.copy(state);
        expected.prefs.splice(1, 1);

        expect(def.remove(state)).toEqual(expected);
        expect(state).toEqual(stateCopy);
      });
    });

    it("isSafe checks if the task can be entered without destroying existing information", function() {
      var state = {
        'problem': { 'criteria' : { 'A' : {} } }
      };
      var task = {
        'resets': ['partial-value-function', 'criteria-trade-offs']
      };
      expect(service.isSafe(task, state)).toEqual({'safe': true, resets: []});
      state.problem.criteria.A.pvf = { 'range': [0, 1], 'type': 'linear', 'direction': 'increasing' };
      expect(service.isSafe(task, state)).toEqual({'safe': false, resets: ['partial-value-function']});
    });

    it("remove() uses definition.remove() to destroy existing information", function() {
      var state = {
        'problem': { 'criteria' : { 'A' : { 'pvf': { 'range': [0, 1], 'type': 'linear', 'direction': 'increasing' } } } }
      };
      var task = {
        'resets': ['partial-value-function', 'criteria-trade-offs']
      };

      var stateCopy = angular.copy(state);
      var expected = angular.copy(state);
      delete expected.problem.criteria.A.pvf.type;
      delete expected.problem.criteria.A.pvf.direction;
      expect(service.remove(task, state)).toEqual(expected);
      expect(state).toEqual(stateCopy);

      state.prefs = {};
      expect(service.remove(task, state)).toEqual(expected);
    });
  });
});
