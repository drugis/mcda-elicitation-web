'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modal', '$state', 'ManualInputService', 'WorkspaceResource'];
  var ManualInputController = function($scope, $modal, $state, ManualInputService, WorkspaceResource) {
    // functions
    $scope.openCriterionModal = openCriterionModal;
    $scope.addTreatment = addTreatment;
    $scope.isDuplicateName = isDuplicateName;
    $scope.goToStep1 = goToStep1;
    $scope.goToStep2 = goToStep2;
    $scope.createProblem = createProblem;
    $scope.checkInputData = checkInputData;

    // vars
    $scope.criteria = [];
    $scope.treatments = [];
    $scope.state = {
      step: 'step1',
      treatmentName: '',
      isInputDataValid: false
    };

    function addTreatment(name) {
      $scope.treatments.push({
        name: name
      });
      $scope.state.treatmentName = '';
    }

    function isDuplicateName(name) {
      return _.find($scope.treatments, ['name', name]);
    }

    function openCriterionModal() {
      $modal.open({
        templateUrl: '/app/js/manualInput/addCriterion.html',
        controller: 'AddCriterionController',
        resolve: {
          criteria: function() {
            return $scope.criteria;
          },
          callback: function() {
            return function(newCriterion) {
              $scope.criteria.push(newCriterion);
            };
          }
        }
      });
    }

    function checkInputData() {
      $scope.state.isInputDataValid = !_.find($scope.inputData, function(row) {
        return _.includes(row, null) || _.includes(row, undefined);
      });
    }

    function goToStep1() {
      $scope.state.step = 'step1';
    }

    function goToStep2() {
      $scope.state.step = 'step2';
      $scope.inputData = ManualInputService.preparePerformanceTable($scope.criteria, $scope.treatments);
      checkInputData();
    }

    function createProblem() {
      var problem = ManualInputService.createProblem($scope.criteria, $scope.treatments, $scope.state.title, $scope.state.description, $scope.inputData);
      WorkspaceResource.create(problem).$promise.then(function(workspace) {
        $state.go('evidence', {
          workspaceId: workspace.id,
          problemId: workspace.defaultSubProblemId,
          id: workspace.defaultScenarioId
        });
      });
      return problem;
    }
  };
  return dependencies.concat(ManualInputController);
});
