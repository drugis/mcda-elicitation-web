define(['underscore'], function(_) {
  this.getOrdinalPreferences = function(prefs) {
    return _.filter(prefs, function(pref) { return pref.type === "ordinal"; });
  };

  this.getCriteriaOrder = function(prefs) {
    return _.reduce(this.getOrdinalPreferences(prefs), function(memo, statement) {
      if (memo.length === 0) {
        return statement.criteria;
      } else {
        if (_.last(memo) !== statement.criteria[0]) {
          console.error("Inconsistent Ordinal preferences detected: expected ", statement, " to start with ", _.last(memo));
          return null;
        }
        return memo.concat(statement.criteria[1]);
      }
    }, []);
  };

  return this;

});
