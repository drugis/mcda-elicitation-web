'use strict';
define(['lodash'], function(_) {

  var dependencies = ['$scope', '$modal', '$state',
    'ManualInputService',
    'WorkspaceResource',
    'addKeyHashToObject'
  ];
  var ManualInputController = function($scope, $modal, $state,
    ManualInputService,
    WorkspaceResource,
    addKeyHashToObject
  ) {

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
    $scope.resetData = resetData;
    $scope.resetRow = resetRow;

    // vars
    $scope.criteria = [];
    $scope.treatments = [];
    $scope.state = {
      step: 'step1',
      treatmentName: '',
      isInputDataValid: false,
      inputMethod: 'distribution',
      studyType: {}
    };

    function resetData() {
      $scope.inputData = ManualInputService.prepareInputData($scope.criteria, $scope.treatments);
      $scope.state.studyType = _.reduce($scope.criteria, function(accum, criterion) {
        accum[criterion.hash] = 'dichotomous';
        return accum;
      }, {});
      $scope.state.isInputDataValid = false;
    }

    function resetRow(hash) {
      _.forEach($scope.inputData[hash], function(cell) {
        cell.label = 'No data entered';
        cell.isInvalid = true;
      });
    }

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
        return _.find(row, 'isInvalid');
      });
    }

    function goToStep1() {
      $scope.state.step = 'step1';
    }

    function goToStep2() {
      $scope.state.step = 'step2';
      $scope.inputMethod = 'distribution';
      $scope.treatments = _.map($scope.treatments, function(treatment) {
        return addKeyHashToObject(treatment, treatment.name);
      });
      $scope.criteria = _.map($scope.criteria, function(criterion) {
        return addKeyHashToObject(criterion, criterion.name);
      });
      $scope.state.studyType = _.reduce($scope.criteria, function(accum, criterion) {
        accum[criterion.hash] = 'dichotomous';
        return accum;
      }, {});
      $scope.inputData = ManualInputService.prepareInputData($scope.criteria, $scope.treatments);
    }

    function createProblem() {
      var problem = ManualInputService.createProblem($scope.criteria, $scope.treatments,
        $scope.state.title, $scope.state.description, $scope.inputData);
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