'use strict';
define(['lodash', 'angular'], function(_) {

  var dependencies = ['$scope', '$modal', '$state', '$stateParams',
    'InProgressResource',
    'ManualInputService',
    'WorkspaceResource',
    'addKeyHashToObject'
  ];
  var ManualInputController = function($scope, $modal, $state, $stateParams,
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

    // vars
    $scope.criteria = [];
    $scope.treatments = [];
    $scope.state = initState();

    function initState() {
      if (!$stateParams.inProgressId) {
        return {
          step: 'step1',
          treatmentInputField: '',
          isInputDataValid: false
        };
      } else {
        InProgressResource.get($stateParams).$promise.then(function(response) {
          $scope = _.merge($scope, response.state);
        });
      }
    }

    function resetData() {
      $scope.inputData = ManualInputService.prepareInputData($scope.criteria, $scope.treatments, $scope.state.inputMethod);
      $scope.state.studyType = resetStudyTypes();
      $scope.state.isInputDataValid = false;
    }

    function resetStudyTypes() {
      return _.reduce($scope.criteria, function(accum, criterion) {
        accum[criterion.hash] = 'dichotomous';
        return accum;
      }, {});
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
      $scope.state.treatmentInputField = '';
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
              if (criterion) { // editing not adding
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
      $scope.state.inputMethod = $scope.state.inputMethod ? $scope.state.inputMethod : 'study';
      $scope.treatments = _.map($scope.treatments, function(treatment) {
        return addKeyHashToObject(treatment, treatment.name);
      });
      $scope.criteria = _.map($scope.criteria, function(criterion) {
        return addKeyHashToObject(criterion, criterion.name);
      });
      $scope.state.studyType = $scope.state.studyType ? $scope.state.studyType : resetStudyTypes();
      $scope.inputData = ManualInputService.prepareInputData($scope.criteria, $scope.treatments, $scope.inputMethod, $scope.inputData);
    }

    function createProblem() {
      var problem = ManualInputService.createProblem($scope.criteria, $scope.treatments,
        $scope.state.title, $scope.state.description, $scope.inputData);
      WorkspaceResource.create(problem).$promise.then(function(workspace) {
        InProgressResource.delete($stateParams); 
        $state.go('evidence', {
          workspaceId: workspace.id,
          problemId: workspace.defaultSubProblemId,
          id: workspace.defaultScenarioId
        });
      });
      return problem;
    }

    function saveInProgress() {
      var blob = {
        criteria: $scope.criteria,
        treatments: $scope.treatments,
        inputData: $scope.inputData,
        state: $scope.state
      };
      if ($stateParams.inProgressId) {
        InProgressResource.put($stateParams, blob);
      } else {
        InProgressResource.save(blob).$promise.then(function(response){
          $state.go('manualInputInProgress', {inProgressId: response.id});
        });
      }
    }

  };
  return dependencies.concat(ManualInputController);
});