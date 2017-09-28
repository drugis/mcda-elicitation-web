'use strict';
define(function(require) {
  var angular = require('angular');
  return angular.module('elicit.workspace', [])
    .controller('ChooseProblemController', require('mcda/workspace/chooseProblemController'))
    .controller('CreateWorkspaceController', require('mcda/workspace/createWorkspaceController'))
    .controller('WorkspaceController', require('mcda/workspace/workspaceController'))
    .service('ExampleResource', require('mcda/workspace/exampleResource'))
    ;
  });
