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
    $scope.isDuplicateTitle = isDuplicateTitle;
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
      if ($stateParams.workspace) {
        // copying existing workspace
        var oldWorkspace = $stateParams.workspace;
        $scope.state = {
          step: 'step1',
          isInputDataValid: false,
          title: oldWorkspace.title,
          description: oldWorkspace.problem.description,
          criteria: copyCriteria(oldWorkspace),
          alternatives: _.map(oldWorkspace.problem.alternatives, function(alternative) {
            return alternative;
          })
        };
        $scope.dirty = true;
        setStateWatcher();
      } else if (!$stateParams.inProgressId) {
        // new workspace
        $scope.state = {
          step: 'step1',
          isInputDataValid: false,
          criteria: [],
          alternatives: []
        };
        setStateWatcher();
      } else {
        // unfinished workspace
        InProgressResource.get($stateParams).$promise.then(function(response) {
          $scope.state = response.state;
          setStateWatcher();
        });
      }
    }

    function copyCriteria(workspace) {
      // move to service
      return _.map(workspace.problem.criteria, function(criterion, key) {
        var newCrit = _.pick(criterion, ['title', 'description', 'source', 'sourceLink']);
        if (workspace.problem.valueTree) {
          newCrit.isFavorable = _.find(workspace.problem.valueTree.children[0].criteria, key) ? true : false;
        }
        var tableEntry = _.find(workspace.problem.performanceTable, ['criterion', key]);
        newCrit.dataSource = tableEntry.performance.type === 'exact' ? 'exact' : 'study';
        if (newCrit.dataSource === 'study') {
          if (tableEntry.performance.type === 'dsurv') {
            // survival
            newCrit.dataType = 'survival';
            newCrit.summaryMeasure = tableEntry.performance.parameters.summaryMeasure;
            newCrit.timePointOfInterest = tableEntry.performance.parameters.time;
            newCrit.timeScale = 'time scale not set';
          } else if (tableEntry.performance.type === 'dt' || tableEntry.performance.type === 'dnorm') {
            // continuous
            newCrit.dataType = 'continuous';
          } else if (tableEntry.performance.type === 'dbeta') {
            // dichotomous
            newCrit.dataType = 'dichotomous';
          } else {
            newCrit.dataType = 'Unknown';
            $scope.hasUnknownDataType = true;
          }
        }
        return newCrit;
      });
    }

    function setStateWatcher() {
      $scope.$watch('state', function(newValue, oldValue) {
        if (!angular.equals(newValue, oldValue)) {
          $scope.dirty = true;
        }
      }, true);
    }

    function resetData() {
      $scope.state.inputData = ManualInputService.prepareInputData($scope.state.criteria, $scope.state.alternatives);
      $scope.state.isInputDataValid = false;
    }

    function resetRow(hash) {
      _.forEach($scope.state.inputData[hash], function(cell) {
        cell.label = 'No data entered';
        cell.isInvalid = true;
      });
    }

    function addTreatment(title) {
      $scope.state.alternatives.push({
        title: title
      });
      $scope.treatmentInputField.value = '';
    }

    function removeTreatment(alternative) {
      $scope.state.alternatives = _.reject($scope.state.alternatives, ['title', alternative.title]);
    }

    function isDuplicateTitle(title) {
      return _.find($scope.state.alternatives, ['title', title]);
    }

    function removeCriterion(criterion) {
      $scope.state.criteria = _.reject($scope.state.criteria, ['title', criterion.title]);
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
              $scope.hasUnknownDataType = _.find($scope.state.criteria, function(criterion) {
                return criterion.dataType === 'Unknown';
              });
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
      $scope.state.alternatives = _.map($scope.state.alternatives, function(alternative) {
        return addKeyHashToObject(alternative, alternative.title);
      });
      $scope.state.criteria = _.map($scope.state.criteria, function(criterion) {
        return addKeyHashToObject(criterion, criterion.title);
      });
      if ($stateParams.workspace) {
        $scope.state.inputData = ManualInputService.prepareInputData($scope.state.criteria, $scope.state.alternatives, $scope.state.inputData);
        _.forEach($scope.state.criteria, function(criterion) {
          _.forEach($scope.state.alternatives, function(alternative) {
            var critKey;
            _.forEach($stateParams.workspace.problem.criteria, function(problemCrit, key) {
              if (problemCrit.title === criterion.title) {
                critKey = key;
              }
            });
            var altKey;
            _.forEach($stateParams.workspace.problem.alternatives, function(problemAlt, key) {
              if (problemAlt.title === alternative.title) {
                altKey = key;
              }
            });
            var tableEntry = _.find($stateParams.workspace.problem.performanceTable, function(tableEntry) {
              return tableEntry.criterion === critKey && tableEntry.alternative === altKey;
            });
            if (tableEntry) {
              var inputDataCell = _.cloneDeep($scope.state.inputData[criterion.hash][alternative.hash]);
              if (tableEntry.performance.type === 'exact') {
                inputDataCell.value = tableEntry.performance.value;
              } else if (tableEntry.performance.type === 'dt') {
                inputDataCell.sampleSize = tableEntry.performance.parameters.dof + 1;
                inputDataCell.stdErr = tableEntry.performance.parameters.stdErr;
                inputDataCell.mu = tableEntry.performance.parameters.mu;
                inputDataCell.continuousType = 'SEt';
              } else if (tableEntry.performance.type === 'dnorm') {
                inputDataCell.stdErr = tableEntry.performance.parameters.sigma;
                inputDataCell.mu = tableEntry.performance.parameters.mu;
                inputDataCell.continuousType = 'SEnorm';
              } else if (tableEntry.performance.type === 'dbeta') {
                inputDataCell.count = tableEntry.performance.parameters.alpha - 1;
                inputDataCell.sampleSize = tableEntry.performance.parameters.beta +
                  inputDataCell.count - 1;
              } else if (tableEntry.performance.type === 'dsurv') {
                inputDataCell.events = tableEntry.performance.parameters.alpha - 0.001;
                inputDataCell.exposure = tableEntry.performance.parameters.beta - 0.001;
                inputDataCell.summaryMeasure = tableEntry.performance.parameters.summaryMeasure;
                inputDataCell.timeScale = tableEntry.performance.parameters.time;
              }
              var distributionData = ManualInputService.createDistribution(inputDataCell, criterion);
              inputDataCell.isInvalid = ManualInputService.isInvalidCell(distributionData);
              inputDataCell.label = ManualInputService.inputToString(distributionData);
              $scope.state.inputData[criterion.hash][alternative.hash] = inputDataCell;
            }
          });
        });
        checkInputData();
      } else {
        $scope.state.inputData = ManualInputService.prepareInputData($scope.state.criteria, $scope.state.alternatives, $scope.state.inputData);
      }
    }

    function createProblem() {
      var problem = ManualInputService.createProblem($scope.state.criteria, $scope.state.alternatives,
        $scope.state.title, $scope.state.description, $scope.state.inputData);
      WorkspaceResource.create(problem).$promise.then(function(workspace) {
        if ($stateParams.inProgressId) {
          InProgressResource.delete($stateParams);
        }
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