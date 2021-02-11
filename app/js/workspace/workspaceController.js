'use strict';

define(['angular', 'lodash'], function (angular, _) {
  var dependencies = [
    '$scope',
    '$cookies',
    '$stateParams',
    'WorkspaceResource',
    'ScenarioResource',
    'SubProblemResource',
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
    SubProblemResource,
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
      const splitVersion = currentWorkspace.problem.schemaVersion.split('.');
      $scope.workspace = SchemaService.updateWorkspaceToCurrentSchema(
        currentWorkspace
      );
      SchemaService.validateProblem($scope.workspace.problem);

      if (SchemaService.earlierThan147(splitVersion)) {
        const pvfs = SchemaService.extractPvfs(
          currentWorkspace.problem.criteria
        );
        const ranges = SchemaService.extractRanges(
          currentWorkspace.problem.criteria
        );
        WorkspaceResource.save($stateParams, $scope.workspace).$promise.then(
          () => {
            if (!_.isEmpty(ranges)) {
              updateDefaultSubproblem(
                currentWorkspace.defaultSubProblemId,
                ranges
              );
            }
            if (!_.isEmpty(pvfs)) {
              updateDefaultScenario(currentWorkspace.defaultScenarioId, pvfs);
            }
          }
        );
      } else {
        WorkspaceResource.save($stateParams, $scope.workspace);
      }
    } else {
      $scope.workspace = currentWorkspace;
    }
    $scope.workspaceForReact = angular.copy($scope.workspace);
    $scope.isEditTitleVisible = false;

    function updateDefaultSubproblem(defaultSubproblemId, ranges, callback) {
      const params = {...$stateParams, problemId: defaultSubproblemId};
      SubProblemResource.get(params).$promise.then((subproblem) => {
        const updatedSubproblem = {
          title: subproblem.title,
          definition: {ranges: ranges}
        };
        SubProblemResource.save(params, updatedSubproblem).$promise.then(
          callback
        );
      });
    }

    function updateDefaultScenario(defaultScenarioId, pvfs, callback) {
      const params = {...$stateParams, scenarioId: defaultScenarioId};
      ScenarioResource.get(params).$promise.then((scenario) => {
        const updatedScenario = SchemaService.mergePvfs(scenario, pvfs);
        ScenarioResource.save(params, updatedScenario).$promise.then(callback);
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
