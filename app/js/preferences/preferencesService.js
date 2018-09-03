'use strict';
define(['lodash', 'angular'], function(_) {

  var dependencies = [];
  var PreferencesService = function() {

    function buildImportance(criteria, preferences) {
      return _.reduce(criteria, function(accum, criterion) {
        var preference;
        if (_.isEmpty(preferences)) {
          // values are unknown
          accum[criterion.id] = '?';
          return accum;
        }
        if (preferences[0].type === 'ordinal') {
          // determine rank for each criterion
          preference = _.findIndex(preferences, function(pref) {
            return pref.criteria[1] === criterion.id;
          });
          accum[criterion.id] = preference !== undefined ? preference + 2 : 1;
        } else {
          preference = _.find(preferences, function(pref) {
            return pref.criteria[1] === criterion.id;
          });
          if (!preference) {
            accum[criterion.id] = '100%';
          } else if (preference.type === 'exact swing') {
            accum[criterion.id] = Math.round((1 / preference.ratio) * 100) + '%';
          } else if (preference.type === 'ratio bound') {
            accum[criterion.id] = Math.round((1 / preference.bounds[1]) * 100) + '-' + Math.round((1 / preference.bounds[0]) * 100) + '%';
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
