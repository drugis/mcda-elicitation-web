'use strict';
define(function(require) {
  var angular = require("angular");
  var _ = require("underscore");

  var dependencies = [];

  var scaleRanges = {
    'isPresent': function(state) {
      var hasScale = function(criterion) {
        return criterion.pvf && criterion.pvf.range;
      };
      return _.every(state.problem.criteria, hasScale);
    },
    'remove': function(state) {
      var newState = angular.copy(state);
      var criteria = newState.problem.criteria;
      _.each(criteria, function(criterion) {
        if (criterion.pvf) {
          delete criterion.pvf.range;
        }
      });
      return newState;
    },
    'title': 'criterion scale ranges'
  };

  var partialValueFunctions = {
    'isPresent': function(state) {
      var criteria = state.problem.criteria;
      return _.every(criteria, function(criterion) {
        var pvf = criterion.pvf;
        return pvf && pvf.direction && pvf.type;
      });
    },
    'remove': function(state) {
      var newState = angular.copy(state);
      var criteria = newState.problem.criteria;
      _.each(criteria, function(criterion) {
        var remove = ['type', 'direction', 'cutoffs', 'values'];
        if (criterion.pvf) {
          criterion.pvf = _.omit(criterion.pvf, remove);
        }
      });
      return newState;
    },
    title: 'partial value functions'
  };

  var criteriaTradeOffs = {
    'isPresent': function(state) {
      return !_.isUndefined(state.prefs);
    },
    'remove': function(state) {
      return _.omit(angular.copy(state), 'prefs');
    },
    title: 'all criteria trade-off preferences'
  };

  var PreferenceFilter = function(test, title) {
    this.isPresent = function(state) {
      return _.some(state.prefs, test);
    };

    this.remove = function(state) {
      var newState = angular.copy(state);
      newState.prefs = _.reject(state.prefs, test);
      return newState;
    };

    this.title = title;

    return this;
  };

  var nonOrdinalPreferences = new PreferenceFilter(
    function(pref) {
      return pref.type !== "ordinal";
    }, 'non-ordinal preferences');

  // This heuristic is not complete; it only checks whether there are ordinal preferences at all.
  // Currently, there is no way to create ordinal preferences that are not a complete ranking.
  var completeCriteriaRanking = new PreferenceFilter(
    function(pref) {
      return pref.type === "ordinal";
    }, 'complete criteria ranking');

  var TaskDependencies = function() {
    var definitions = {
      'scale-range': scaleRanges,
      'partial-value-function': partialValueFunctions,
      'criteria-trade-offs': criteriaTradeOffs,
      'non-ordinal-preferences': nonOrdinalPreferences,
      'complete-criteria-ranking': completeCriteriaRanking
    };
    var remove = function(task, state) {
      return _.reduce(task.resets, function(memo, reset) {
        return definitions[reset].remove(memo);
      }, state);
    };

    var isAccessible = function(task, state) {
      if (!state || !state.problem) {
        return false;
      }
      var requires = _.filter(task.requires, function(require) {
        return !definitions[require].isPresent(state);
      });
      return {
        accessible: _.isEmpty(requires),
        requires: requires
      };
    };

    var isSafe = function(task, state) {
      var resets = _.filter(task.resets, function(reset) {
        return definitions[reset].isPresent(state);
      });
      return {
        safe: _.isEmpty(resets),
        resets: resets
      };
    };

    return {
      definitions: definitions,
      isAccessible: isAccessible,
      isSafe: isSafe,
      remove: remove,
      extendTaskDefinition: function(task) {
        return _.extend(task, {
          clean: _.partial(remove, task),
          isAccessible: _.partial(isAccessible, task),
          isSafe: _.partial(isSafe, task)
        });
      }
    };
  };

  return angular.module('elicit.taskDependencies', dependencies).factory('TaskDependencies', TaskDependencies);
});
