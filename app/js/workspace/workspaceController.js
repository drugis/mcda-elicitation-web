'use strict';

define(['angular', 'async', 'lodash'], function (angular, async, _) {
  var dependencies = [
    '$scope',
    '$cookies',
    '$stateParams',
    'WorkspaceResource',
    'ScenarioResource',
    'WorkspaceSettingsService',
    'SchemaService',
    'currentWorkspace',
    'currentSchemaVersion'
  ];
  var WorkspaceController = function (
    $scope,
    $cookies,
    $stateParams,
    WorkspaceResource,
    ScenarioResource,
    WorkspaceSettingsService,
    SchemaService,
    currentWorkspace,
    currentSchemaVersion
  ) {
    // functions
    $scope.editTitle = editTitle;
    $scope.saveTitle = saveTitle;
    $scope.cancelTitle = cancelTitle;

    // init
    var user = angular.fromJson($cookies.get('LOGGED-IN-USER'));
    $scope.editMode = {
      canEdit: user ? currentWorkspace.owner === user.id : false
    };
    if (currentWorkspace.problem.schemaVersion !== currentSchemaVersion) {
      const pvfs = SchemaService.extractPvfs(currentWorkspace.problem.criteria);
      $scope.workspace = SchemaService.updateWorkspaceToCurrentSchema(
        currentWorkspace
      );
      SchemaService.validateProblem($scope.workspace.problem);
      WorkspaceResource.save($stateParams, $scope.workspace).$promise.then(
        () => {
          if (!_.isEmpty(pvfs)) {
            updateDefaultScenario(currentWorkspace.defaultScenarioId, pvfs);
          }
        }
      );
    } else {
      $scope.workspace = currentWorkspace;
    }
    $scope.workspaceForReact = angular.copy($scope.workspace);
    getWorkspaceSettings();
    $scope.$on('elicit.settingsChanged', getWorkspaceSettings);
    $scope.isEditTitleVisible = false;

    function getWorkspaceSettings() {
      $scope.toggledColumns = WorkspaceSettingsService.getToggledColumns();
      $scope.workspaceSettings = WorkspaceSettingsService.setWorkspaceSettings(
        $scope.workspace.problem.performanceTable
      );
    }

    function updateDefaultScenario(defaultScenarioId, pvfs, callback) {
      const coords = _.merge({}, $stateParams, {scenarioId: defaultScenarioId});
      ScenarioResource.get(coords).$promise.then((scenario) => {
        const updatedScenario = SchemaService.mergePvfs(scenario, pvfs);
        ScenarioResource.save(coords, updatedScenario).$promise.then(callback);
      });
    }

    function editTitle() {
      $scope.isEditTitleVisible = true;
      $scope.workspace.title = $scope.workspace.problem.title;
    }

    function saveTitle() {
      $scope.workspace.problem.title = $scope.workspace.title;
      WorkspaceResource.save($stateParams, $scope.workspace);
      $scope.isEditTitleVisible = false;
    }

    function cancelTitle() {
      $scope.isEditTitleVisible = false;
    }
  };
  return dependencies.concat(WorkspaceController);
});
