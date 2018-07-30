'use strict';
var requires = [
  'mcda/workspace/chooseProblemController',
  'mcda/workspace/createWorkspaceController',
  'mcda/workspace/deleteWorkspaceController',
  'mcda/workspace/deleteInProgressController',
  'mcda/workspace/workspaceController',
  'mcda/workspace/workspaceSettingsController',
  'mcda/services/workspaceService',
  'mcda/workspace/orderingService',
  'mcda/workspace/exampleResource'
];
define(['angular'].concat(requires), function(
  angular,
  ChooseProblemController,
  CreateWorkspaceController,
  DeleteWorkspaceController,
  DeleteInProgressController,
  WorkspaceController,
  WorkspaceSettingsController,
  WorkspaceService,
  OrderingService,
  ExampleResource
) {
  return angular.module('elicit.workspace', ['elicit.util'])
    .controller('ChooseProblemController', ChooseProblemController)
    .controller('CreateWorkspaceController', CreateWorkspaceController)
    .controller('DeleteWorkspaceController', DeleteWorkspaceController)
    .controller('DeleteInProgressController', DeleteInProgressController)
    .controller('WorkspaceController', WorkspaceController)
    .controller('WorkspaceSettingsController', WorkspaceSettingsController)

    .factory('WorkspaceService', WorkspaceService)
    .factory('OrderingService', OrderingService)

    .service('ExampleResource', ExampleResource)
    ;
});
