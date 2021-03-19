'use strict';

define([
  './chooseProblemController',
  './workspaceController',

  '../services/workspaceService',

  '../../ts/WorkspaceSettings/WorkspaceSettingsWrapper',
  '../../ts/Workspaces/Workspaces',
  'react2angular',

  'angular',
  '../util'
], function (
  ChooseProblemController,
  WorkspaceController,

  WorkspaceService,

  WorkspaceSettingsWrapper,
  Workspaces,
  react2angular,

  angular
) {
  return angular
    .module('elicit.workspace', ['elicit.util'])
    .controller('ChooseProblemController', ChooseProblemController)
    .controller('WorkspaceController', WorkspaceController)

    .factory('WorkspaceService', WorkspaceService)

    .component(
      'workspaceSettings',
      react2angular.react2angular(WorkspaceSettingsWrapper.default, [
        'editMode',
        'workspace'
      ])
    )
    .component(
      'workspaces',
      react2angular.react2angular(Workspaces.default, [])
    );
});
