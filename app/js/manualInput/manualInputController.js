'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modal', '$state', 'ManualInputService', 'WorkspaceResource', 'EffectsTableResource'];
  var ManualInputController = function($scope, $modal, $state, ManualInputService, WorkspaceResource, EffectsTableResource) {
    // functions
    $scope.openCriterionModal = openCriterionModal;
    $scope.addTreatment = addTreatment;
    $scope.removeTreatment = removeTreatment;
    $scope.isDuplicateName = isDuplicateName;
    $scope.goToStep1 = goToStep1;
    $scope.goToStep2 = goToStep2;
    $scope.createProblem = createProblem;
    $scope.removeCriterion = removeCriterion;
    $scope.checkInputData = checkInputData;

    // vars
    $scope.criteria = [];
    $scope.treatments = [];
    $scope.state = {
      step: 'step1',
      treatmentName: '',
      isInputDataValid: false
    };
    $scope.distributionOptions = [{
      name: 'exact values',
      type: 'exact'
    }, {
      name: 'normal distribution',
      type: 'normal' //check if correct
    }, {
      name: 'beta distribution',
      type: 'dbeta'
    }];


    function addTreatment(name) {
      $scope.treatments.push({
        name: name
      });
      $scope.state.treatmentName = '';
    }

    function removeTreatment(treatment) {
      $scope.treatments = _.reject($scope.treatments, ['name', treatment.name]);
    }

    function isDuplicateName(name) {
      return _.find($scope.treatments, ['name', name]);
    }

    function removeCriterion(criterion) {
      $scope.criteria = _.reject($scope.criteria, ['name', criterion.name]);
    }

    function openCriterionModal(criterion) {
      $modal.open({
        templateUrl: '/app/js/manualInput/addCriterion.html',
        controller: 'AddCriterionController',
        resolve: {
          criteria: function() {
            return $scope.criteria;
          },
          callback: function() {
            return function(newCriterion) {
              if (criterion) {
                removeCriterion(criterion);
              }
              $scope.criteria.push(newCriterion);
            };
          },
          oldCriterion: function() {
            return criterion;
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
      $scope.dataTypes = ManualInputService.prepareDataTypes($scope.criteria,$scope.treatments);
      checkInputData();
    }

    function createProblem() {
      var problem = ManualInputService.createProblem($scope.criteria, $scope.treatments, $scope.state.title, $scope.state.description, $scope.inputData);
      WorkspaceResource.create(problem).$promise.then(function(workspace) {
        EffectsTableResource.setEffectsTableInclusions({
          workspaceId: workspace.id
        }, {
          alternativeIds: _.map(problem.alternatives, function(alternative, key) {
            return key;
          })
        });
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