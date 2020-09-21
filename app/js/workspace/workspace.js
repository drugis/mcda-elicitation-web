'use strict';

define([
  './chooseProblemController',
  './createWorkspaceController',
  './deleteWorkspaceController',
  './deleteInProgressController',
  './workspaceController',
  './workspaceSettingsController',

  '../services/workspaceService',
  '../services/performanceTableService',
  './orderingService',
  './workspaceSettingsService',

  './exampleResource',
  './tutorialResource',

  './fileReaderDirective',
  './workspaceSettingsDirective',
  './workspacesDirective',
  './inProgressWorkspacesDirective',
  'angular',
  '../util',
  '../results/results'
], function (
  ChooseProblemController,
  CreateWorkspaceController,
  DeleteWorkspaceController,
  DeleteInProgressController,
  WorkspaceController,
  WorkspaceSettingsController,

  WorkspaceService,
  PerformanceTableService,
  OrderingService,
  WorkspaceSettingService,

  ExampleResource,
  TutorialResource,

  fileReaderDirective,
  WorkspaceSettings,
  Workspaces,
  InProgressWorkspaces,
  angular
) {
  return angular
    .module('elicit.workspace', ['elicit.util', 'elicit.results'])
    .controller('ChooseProblemController', ChooseProblemController)
    .controller('CreateWorkspaceController', CreateWorkspaceController)
    .controller('DeleteWorkspaceController', DeleteWorkspaceController)
    .controller('DeleteInProgressController', DeleteInProgressController)
    .controller('WorkspaceController', WorkspaceController)
    .controller('WorkspaceSettingsController', WorkspaceSettingsController)

    .factory('WorkspaceService', WorkspaceService)
    .factory('PerformanceTableService', PerformanceTableService)
    .factory('OrderingService', OrderingService)
    .factory('WorkspaceSettingsService', WorkspaceSettingService)

    .service('ExampleResource', ExampleResource)
    .service('TutorialResource', TutorialResource)

    .directive('fileReader', fileReaderDirective)
    .directive('workspaceSettings', WorkspaceSettings)
    .directive('workspaces', Workspaces)
    .directive('inProgressWorkspaces', InProgressWorkspaces);
});
