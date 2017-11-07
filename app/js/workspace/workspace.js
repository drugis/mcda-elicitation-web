'use strict';
var requires = [
  'mcda/workspace/chooseProblemController',
  'mcda/workspace/createWorkspaceController',
  'mcda/workspace/deleteWorkspaceController',
  'mcda/workspace/deleteInProgressController',
  'mcda/workspace/workspaceController',
  'mcda/services/workspaceService',
  'mcda/workspace/exampleResource'
];
define(['angular'].concat(requires), function(
  angular,
  ChooseProblemController,
  CreateWorkspaceController,
  DeleteWorkspaceController,
  DeleteInProgressController,
  WorkspaceController,
  WorkspaceService,
  ExampleResource
) {
  return angular.module('elicit.workspace', [])
    .controller('ChooseProblemController', ChooseProblemController)
    .controller('CreateWorkspaceController', CreateWorkspaceController)
    .controller('DeleteWorkspaceController', DeleteWorkspaceController)
    .controller('DeleteInProgressController', DeleteInProgressController)
    .controller('WorkspaceController', WorkspaceController)

    .factory('WorkspaceService', WorkspaceService)
    
    .service('ExampleResource', ExampleResource)
    ;
});