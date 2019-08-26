'use strict';

define([
  './chooseProblemController',
  './createWorkspaceController',
  './deleteWorkspaceController',
  './deleteInProgressController',
  './workspaceController',
  './workspaceSettingsController',
  '../services/workspaceService',
  './orderingService',
  './workspaceSettingsService',
  './exampleResource',
  './tutorialResource',
  './workspaceSettingsDirective',
  './workspacesDirective',
  './inProgressWorkspacesDirective',
  'angular',
  '../util',
  '../results/results'
], function(
  ChooseProblemController,
  CreateWorkspaceController,
  DeleteWorkspaceController,
  DeleteInProgressController,
  WorkspaceController,
  WorkspaceSettingsController,
  WorkspaceService,
  OrderingService,
  WorkspaceSettingService,
  ExampleResource,
  TutorialResource,
  WorkspaceSettings,
  Workspaces,
  InProgressWorkspaces,
  angular
) {
    return angular.module('elicit.workspace', ['elicit.util', 'elicit.results'])
      .controller('ChooseProblemController', ChooseProblemController)
      .controller('CreateWorkspaceController', CreateWorkspaceController)
      .controller('DeleteWorkspaceController', DeleteWorkspaceController)
      .controller('DeleteInProgressController', DeleteInProgressController)
      .controller('WorkspaceController', WorkspaceController)
      .controller('WorkspaceSettingsController', WorkspaceSettingsController)

      .factory('WorkspaceService', WorkspaceService)
      .factory('OrderingService', OrderingService)
      .factory('WorkspaceSettingsService', WorkspaceSettingService)

      .service('ExampleResource', ExampleResource)
      .service('TutorialResource', TutorialResource)

      .directive('workspaceSettings', WorkspaceSettings)
      .directive('workspaces', Workspaces)
      .directive('inProgressWorkspaces', InProgressWorkspaces)
      ;
  });
