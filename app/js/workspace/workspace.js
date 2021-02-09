'use strict';

define([
  './chooseProblemController',
  './createWorkspaceController',
  './deleteInProgressController',
  './workspaceController',
  './workspaceSettingsController',

  '../services/workspaceService',
  '../services/performanceTableService',
  './workspaceSettingsService',
  '../services/pataviResultsService',

  './exampleResource',
  './tutorialResource',

  './fileReaderDirective',
  './inProgressWorkspacesDirective',

  '../../ts/WorkspaceSettings/WorkspaceSettingsWrapper',
  '../../ts/Workspaces/Workspaces',
  'react2angular',

  'angular',
  '../util'
], function (
  ChooseProblemController,
  CreateWorkspaceController,
  DeleteInProgressController,
  WorkspaceController,
  WorkspaceSettingsController,

  WorkspaceService,
  PerformanceTableService,
  WorkspaceSettingService,
  PataviResultsService,

  ExampleResource,
  TutorialResource,

  fileReaderDirective,
  InProgressWorkspaces,

  WorkspaceSettingsWrapper,
  Workspaces,
  react2angular,

  angular
) {
  return angular
    .module('elicit.workspace', ['elicit.util'])
    .controller('ChooseProblemController', ChooseProblemController)
    .controller('CreateWorkspaceController', CreateWorkspaceController)
    .controller('DeleteInProgressController', DeleteInProgressController)
    .controller('WorkspaceController', WorkspaceController)
    .controller('WorkspaceSettingsController', WorkspaceSettingsController)

    .factory('WorkspaceService', WorkspaceService)
    .factory('PerformanceTableService', PerformanceTableService)
    .factory('WorkspaceSettingsService', WorkspaceSettingService)
    .factory('PataviResultsService', PataviResultsService)

    .service('ExampleResource', ExampleResource)
    .service('TutorialResource', TutorialResource)

    .directive('fileReader', fileReaderDirective)
    .directive('inProgressWorkspaces', InProgressWorkspaces)

    .component(
      'workspaceSettings',
      react2angular.react2angular(WorkspaceSettingsWrapper.default, [
        'editMode',
        'workspaceSettings',
        'toggledColumns'
      ])
    )
    .component(
      'workspaces',
      react2angular.react2angular(Workspaces.default, [])
    );
});
