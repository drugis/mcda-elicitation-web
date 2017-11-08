'use strict';
define(['lodash', 'angular'], function(_, angular) {
  var dependencies = ['$scope', '$modal', '$state', '$stateParams', '$transitions',
    'InProgressResource',
    'ManualInputService',
    'WorkspaceResource',
    'addKeyHashToObject'
  ];
  var ManualInputController = function($scope, $modal, $state, $stateParams, $transitions,
    InProgressResource,
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
    $scope.saveInProgress = saveInProgress;

    // init
    $scope.treatmentInputField = {}; //scoping
    initState();

    $transitions.onStart({}, function(transition) {
      if ($scope.dirty) {
        var answer = confirm('There are unsaved changes, are you sure you want to leave this page?');
        if (!answer) {
          transition.abort();
        } else {
          $scope.dirty = false;
        }
      }
    });

    function initState() {
      if (!$stateParams.inProgressId) {
        $scope.state = {
          step: 'step1',
          isInputDataValid: false,
          criteria: [],
          treatments: []
        };
        setStateWatcher();
      } else {
        InProgressResource.get($stateParams).$promise.then(function(response) {
          $scope.state = response.state;
          setStateWatcher();
        });
      }
    }

    function setStateWatcher() {
      $scope.$watch('state', function(newValue, oldValue) {
        if (!angular.equals(newValue, oldValue)) {
          $scope.dirty = true;
        }
      }, true);
    }

    function resetData() {
      $scope.state.inputData = ManualInputService.prepareInputData($scope.state.criteria, $scope.state.treatments);
      $scope.state.studyType = resetStudyTypes();
      $scope.state.isInputDataValid = false;
    }

    function resetStudyTypes() {
      return _.reduce($scope.state.criteria, function(accum, criterion) {
        accum[criterion.hash] = 'dichotomous';
        return accum;
      }, {});
    }

    function resetRow(hash) {
      _.forEach($scope.state.inputData[hash], function(cell) {
        cell.label = 'No data entered';
        cell.isInvalid = true;
      });
    }

    function addTreatment(name) {
      $scope.state.treatments.push({
        name: name
      });
      $scope.treatmentInputField.value = '';
    }

    function removeTreatment(treatment) {
      $scope.state.treatments = _.reject($scope.state.treatments, ['name', treatment.name]);
    }

    function isDuplicateName(name) {
      return _.find($scope.state.treatments, ['name', name]);
    }

    function removeCriterion(criterion) {
      $scope.state.criteria = _.reject($scope.state.criteria, ['name', criterion.name]);
    }

    function openCriterionModal(criterion) {
      $modal.open({
        templateUrl: '/js/manualInput/addCriterion.html',
        controller: 'AddCriterionController',
        resolve: {
          criteria: function() {
            return $scope.state.criteria;
          },
          callback: function() {
            return function(newCriterion) {
              if (criterion) { // editing not adding
                removeCriterion(criterion);
              }
              $scope.state.criteria.push(newCriterion);
            };
          },
          oldCriterion: function() {
            return criterion;
          }
        }
      });
    }

    function checkInputData() {
      $scope.state.isInputDataValid = !_.find($scope.state.inputData, function(row) {
        return _.find(row, 'isInvalid');
      });
    }

    function goToStep1() {
      $scope.state.step = 'step1';
    }

    function goToStep2() {
      $scope.state.step = 'step2';
      $scope.state.treatments = _.map($scope.state.treatments, function(treatment) {
        return addKeyHashToObject(treatment, treatment.name);
      });
      $scope.state.criteria = _.map($scope.state.criteria, function(criterion) {
        return addKeyHashToObject(criterion, criterion.name);
      });
      $scope.state.studyType = $scope.state.studyType ? $scope.state.studyType : resetStudyTypes();
      $scope.state.inputData = ManualInputService.prepareInputData($scope.state.criteria, $scope.state.treatments, $scope.state.inputData);
    }

    function createProblem() {
      var problem = ManualInputService.createProblem($scope.state.criteria, $scope.state.treatments,
        $scope.state.title, $scope.state.description, $scope.state.inputData);
      WorkspaceResource.create(problem).$promise.then(function(workspace) {
        InProgressResource.delete($stateParams);
        $scope.dirty = false;
        $state.go('evidence', {
          workspaceId: workspace.id,
          problemId: workspace.defaultSubProblemId,
          id: workspace.defaultScenarioId
        });
      });
      return problem;
    }

    function saveInProgress() {
      $scope.dirty = false;
      if ($stateParams.inProgressId) {
        InProgressResource.put($stateParams, $scope.state);
      } else {
        InProgressResource.save($scope.state).$promise.then(function(response) {
          $state.go('manualInputInProgress', {
            inProgressId: response.id
          });
        });
      }
    }

  };
  return dependencies.concat(ManualInputController);
});