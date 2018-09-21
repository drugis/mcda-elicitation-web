'use strict';
define(['lodash', 'angular'], function(_, angular) {
  var dependencies = [];

  var scaleRanges = {
    isPresent: function(state) {
      var hasScale = function(criterion) {
        return criterion.dataSources.length === 1 && criterion.dataSources[0].pvf && criterion.dataSources[0].pvf.range;
      };
      return _.every(state.problem.criteria, hasScale);
    },
    remove: function(state) {
      var newState = angular.copy(state);
      var criteria = newState.problem.criteria;
      _.each(criteria, function(criterion) {
        if (criterion.dataSources[0].pvf) {
          delete criterion.dataSources[0].pvf.range;
        }
      });
      return newState;
    },
    title: 'criterion scale ranges'
  };

  var partialValueFunctions = {
    isPresent: function(state) {
      var criteria = state.problem.criteria;
      return _.every(criteria, function(criterion) {
        var pvf = criterion.dataSources[0].pvf;
        return pvf && pvf.direction && pvf.type;
      });
    },
    remove: function(state) {
      var newState = angular.copy(state);
      var criteria = newState.problem.criteria;
      _.each(criteria, function(criterion) {
        var remove = ['type', 'direction', 'cutoffs', 'values'];
        if (criterion.dataSources[0].pvf) {
          criterion.dataSources[0].pvf = _.omit(criterion.dataSources[0].pvf, remove);
        }
      });
      return newState;
    },
    title: 'partial value functions'
  };

  var criteriaTradeOffs = {
    isPresent: function(state) {
      return !_.isEmpty(state.prefs);
    },
    remove: function(state) {
      return _.omit(angular.copy(state), 'prefs');
    },
    title: 'all criteria trade-off preferences'
  };

  function PreferenceFilter(test, title) {
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
  }

  var nonOrdinalPreferences = new PreferenceFilter(
    function(pref) {
      return pref.type !== 'ordinal';
    }, 'non-ordinal preferences');

  // This heuristic is not complete; it only checks whether there are ordinal preferences at all.
  // Currently, there is no way to create ordinal preferences that are not a complete ranking.
  var completeCriteriaRanking = new PreferenceFilter(
    function(pref) {
      return pref.type === 'ordinal';
    }, 'complete criteria ranking');

  function TaskDependencies() {
    var definitions = {
      'scale-range': scaleRanges,
      'partial-value-function': partialValueFunctions,
      'criteria-trade-offs': criteriaTradeOffs,
      'non-ordinal-preferences': nonOrdinalPreferences,
      'complete-criteria-ranking': completeCriteriaRanking
    };
    function remove(task, state) {
      return _.reduce(task.resets, function(memo, reset) {
        return definitions[reset].remove(memo);
      }, state);
    }

    function isAccessible(task, state) {
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
    }

    function isSafe(task, state) {
      var resets = _.filter(task.resets, function(reset) {
        return definitions[reset].isPresent(state);
      });
      return {
        safe: _.isEmpty(resets),
        resets: resets
      };
    }

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
  }

  return angular.module('elicit.taskDependencies', dependencies).factory('TaskDependencies', TaskDependencies);
});
