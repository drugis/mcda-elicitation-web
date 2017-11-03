'use strict';
define(['lodash', 'angular'], function(_) {
  var dependencies = [];
  var EvidenceService = function() {

  	function editCriterion(oldCriterion, newCriterion, problem) {
  		var editedProblem = _.cloneDeep(problem);

  		if (oldCriterion.title === newCriterion.title) {
  			editedProblem.criteria[newCriterion.title] = newCriterion;
  		} else {
  			delete editedProblem.criteria[oldCriterion.title];
  			editedProblem.criteria[newCriterion.title] = newCriterion;
  			editedProblem.performanceTable = editedProblem.performanceTable.map(function(entry) {
  				if(entry.criterion === oldCriterion.title) {
  					entry.criterion = newCriterion.title;
  				}
  				return entry;
  			});
  		}

  		return editedProblem;
  	}

    return { editCriterion: editCriterion };

  };
  return dependencies.concat(EvidenceService);
});