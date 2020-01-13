'use strict';
define(['lodash', 'angular'], function(_, angular) {

  var dependencies = [
    'PataviResultsService'
  ];
  var PreferencesService = function(
    PataviResultsService
  ) {

    function buildImportance(criteria, preferences) {
      return _.reduce(criteria, function(accum, criterion) {
        if (_.isEmpty(preferences)) {
          accum[criterion.id] = '?';
        } else if (preferences[0].type === 'ordinal') {
          accum[criterion.id] = determineRank(preferences, criterion.id);
        } else {
          accum[criterion.id] = buildCriterionImportance(preferences, criterion.id);
        }
        return accum;
      }, {});
    }

    function determineRank(preferences, criterionId) {
      var preference = _.findIndex(preferences, function(pref) {
        return pref.criteria[1] === criterionId;
      });
      return preference !== undefined ? preference + 2 : 1;
    }

    function buildCriterionImportance(preferences, criterionId) {
      var preference = _.find(preferences, function(pref) {
        return pref.criteria[1] === criterionId;
      });
      if (!preference) {
        return '100%';
      } else if (preference.type === 'exact swing') {
        return getExactValue(preference);
      } else if (preference.type === 'ratio bound') {
        return getImpreciseValue(preference);
      }
    }

    function getImpreciseValue(preference) {
      return Math.round((1 / preference.bounds[1]) * 100) + '-' +
        Math.round((1 / preference.bounds[0]) * 100) + '%';
    }

    function getExactValue(preference) {
      return Math.round((1 / preference.ratio) * 100) + '%';
    }

    function getWeights(problem) {
      var newProblem = angular.copy(problem);
      newProblem.method = 'representativeWeights';
      return PataviResultsService.postAndHandleResults(newProblem);
    }

    return {
      buildImportance: buildImportance,
      getWeights: getWeights
    };
  };
  return dependencies.concat(PreferencesService);

});
