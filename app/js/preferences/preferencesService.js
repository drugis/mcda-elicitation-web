'use strict';
define(['lodash', 'angular'], function(_) {

  var dependencies = [];
  var PreferencesService = function() {

    function buildImportance(criteria, preferences) {
      return _.reduce(criteria, function(accum, criterion) {
        if (_.isEmpty(preferences)) {
          // values are unknown
          accum[criterion.id] = '?';
        } else if (preferences[0].type === 'ordinal') {
          // determine rank for each criterion
          var preference = _.findIndex(preferences, function(pref) {
            return pref.criteria[1] === criterion.id;
          });
          if (preference !== undefined) {
            accum[criterion.id] = preference  + 2;
          } else {
            accum[criterion.id] = 1;
          }
        } else if (preferences[0].type === 'exact swing') {
          var preference = _.find(preferences, function(pref) {
            return pref.criteria[1] === criterion.id;
          });
          if (preference !== undefined) {
            accum[criterion.id] = (1 / preference.ratio) * 100 + '%';
          } else {
            accum[criterion.id] = '100%';
          }
        } else if (preferences[0].type === 'interval swing') {
          var preference = _.find(preferences, function(pref) {
            return pref.criteria[1] === criterion.id;
          });
          if (preference !== undefined) {
            accum[criterion.id] = (1 / preference.bounds[0]) * 100 + '-' + (1 / preference.bounds[1]) * 100 + '%';
          } else {
            accum[criterion.id] = '100%';
          }
        }


        return accum;
      }, {});
    }
    return {
      buildImportance: buildImportance
    };
  };
  return dependencies.concat(PreferencesService);

});