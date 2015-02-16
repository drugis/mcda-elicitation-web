'use strict';
define(function(require) {
  var _ = require("underscore");

  var getOrdinalPreferences = function(prefs) {
    return _.filter(prefs, function(pref) { return pref.type === "ordinal"; });
  };

  var getCriteriaOrder = function(prefs) {
    return _.reduce(getOrdinalPreferences(prefs), function(memo, statement) {
      if (memo.length === 0) {
        return statement.criteria;
      } else {
        if (_.last(memo) !== statement.criteria[0]) {
          return null;
        }
        return memo.concat(statement.criteria[1]);
      }
    }, []);
  };

  return { getOrdinalPreferences: getOrdinalPreferences,
           getCriteriaOrder: getCriteriaOrder };

});
