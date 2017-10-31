'use strict';
define(function(require) {
  var angular = require('angular');
  return angular.module('elicit.evidence', [])

    .controller('EvidenceController', require('mcda/evidence/evidenceController'))
    .controller('EditTherapeuticContextController', require('mcda/evidence/editTherapeuticContextController'))
		;

  });
