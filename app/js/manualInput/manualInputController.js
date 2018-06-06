'use strict';
define(['lodash', 'angular'], function(_, angular) {
  var dependencies = ['$scope',
    '$modal',
    '$state',
    '$stateParams',
    '$transitions',
    '$timeout',
    'EffectsTableService',
    'InProgressResource',
    'ManualInputService',
    'OrderingService',
    'SchemaService',
    'WorkspaceResource',
    'generateUuid'
  ];
  var ManualInputController = function($scope,
    $modal,
    $state,
    $stateParams,
    $transitions,
    $timeout,
    EffectsTableService,
    InProgressResource,
    ManualInputService,
    OrderingService,
    SchemaService,
    WorkspaceResource,
    generateUuid
  ) {

    // functions
    $scope.addAlternative = addAlternative;
    $scope.editDataSource = editDataSource;
    $scope.alternativeDown = alternativeDown;
    $scope.alternativeUp = alternativeUp;
    $scope.dataSourceDown = dataSourceDown;
    $scope.dataSourceUp = dataSourceUp;
    $scope.checkInputData = checkInputData;
    $scope.criterionDown = criterionDown;
    $scope.criterionUp = criterionUp;
    $scope.canCriterionGoUp = canCriterionGoUp;
    $scope.canCriterionGoDown = canCriterionGoDown;
    $scope.createProblem = createProblem;
    $scope.favorabilityChanged = favorabilityChanged;
    $scope.goToStep1 = goToStep1;
    $scope.goToStep2 = goToStep2;
    $scope.isDuplicateTitle = isDuplicateTitle;
    $scope.openCriterionModal = openCriterionModal;
    $scope.removeAlternative = removeAlternative;
    $scope.removeCriterion = removeCriterion;
    $scope.removeDataSource = removeDataSource;
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

    $scope.inputMethods = {
      manualDistribution: 'Manual distribution',
      assistedDistribution: 'Assisted distribution'
    };

    $scope.parameterOfInterest = {
      mean: 'Mean',
      median: 'Median',
      cumulativeProbability: 'Cumulative probability',
      eventProbability: 'Event probability',
      value: 'value'
    };

    // public functions
    function addAlternative(title) {
      $scope.state.alternatives.push({
        title: title,
        id: generateUuid()
      });
      $scope.treatmentInputField.value = '';
    }

    function editDataSource(criterion, oldDataSourceIdx) {
      $modal.open({
        templateUrl: '/js/manualInput/addDataSource.html',
        controller: 'AddDataSourceController',
        resolve: {
          callback: function() {
            return function(newDataSource) {
              if (oldDataSourceIdx >= 0) {
                criterion.dataSources[oldDataSourceIdx] = newDataSource;
              } else {
                criterion.dataSources.push(newDataSource);
              }
            };
          },
          criterion: function() {
            return criterion;
          },
          oldDataSourceIdx: function() {
            return oldDataSourceIdx;
          }
        }
      });
    }

    function canCriterionGoUp(criterion, index) {
      return index !== 0 &&
        (!$scope.state.useFavorability ||
          (criterion.isFavorable === $scope.state.criteria[index - 1].isFavorable));
    }

    function canCriterionGoDown(criterion, index) {
      return index !== $scope.state.criteria.length - 1 &&
        (!$scope.state.useFavorability ||
          (criterion.isFavorable === $scope.state.criteria[index + 1].isFavorable));
    }

    function checkInputData() {
      $scope.state.isInputDataValid = !_.find($scope.state.inputData, function(row) {
        return _.find(row, 'isInvalid');
      });
    }

    function alternativeDown(idx) {
      swap($scope.state.alternatives, idx, idx + 1);
    }

    function alternativeUp(idx) {
      swap($scope.state.alternatives, idx, idx - 1);
    }

    function criterionDown(idx) {
      swap($scope.state.criteria, idx, idx + 1);
    }

    function criterionUp(idx) {
      swap($scope.state.criteria, idx, idx - 1);
    }

    function dataSourceDown(criterion, idx) {
      swap(criterion.dataSources, idx, idx + 1);
    }

    function dataSourceUp(criterion, idx) {
      swap(criterion.dataSources, idx, idx - 1);
    }

    function createProblem() {
      var problem = ManualInputService.createProblem($scope.state.criteria, $scope.state.alternatives,
        $scope.state.title, $scope.state.description, $scope.state.inputData, $scope.state.useFavorability);
      WorkspaceResource.create(problem).$promise.then(function(workspace) {
        if ($stateParams.inProgressId) {
          InProgressResource.delete($stateParams);
        }
        var criteria = _.map($scope.state.criteria, _.partialRight(_.pick, ['id']));
        var alternatives = _.map($scope.state.alternatives, _.partialRight(_.pick, ['id']));

        OrderingService.saveOrdering({
          workspaceId: workspace.id
        }, criteria, alternatives).then(function() {
          $scope.dirty = false;
          $state.go('evidence', {
            workspaceId: workspace.id,
            problemId: workspace.defaultSubProblemId,
            id: workspace.defaultScenarioId
          });
        });
      });
      return problem;
    }

    function favorabilityChanged() {
      $scope.hasMissingFavorability = _.find($scope.state.criteria, function(criterion) {
        return criterion.isFavorable === undefined;
      });
      if ($scope.state.useFavorability && !$scope.hasMissingFavorability) {
        sortCriteria();
      }
    }

    function goToStep1() {
      $scope.state.step = 'step1';
    }

    function goToStep2() {
      $scope.state.step = 'step2';
      $scope.criteriaRows = EffectsTableService.buildTableRows($scope.state.criteria);
      $scope.state.inputData = ManualInputService.prepareInputData($scope.state.criteria, $scope.state.alternatives,
        $scope.state.inputData);
      $timeout(checkInputData);
    }

    function isDuplicateTitle(title) {
      return _.find($scope.state.alternatives, ['title', title]);
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
              checkForUnknownCriteria($scope.state.criteria);
              favorabilityChanged();
            };
          },
          oldCriterion: function() {
            return criterion;
          },
          useFavorability: function() {
            return $scope.state.useFavorability;
          }
        }
      });
    }

    function removeCriterion(criterion) {
      $scope.state.criteria = _.reject($scope.state.criteria, ['id', criterion.id]);
      if ($scope.state.inputData) {
        delete $scope.state.inputData[criterion.id];
      }
      checkForUnknownCriteria($scope.state.criteria);
      favorabilityChanged();
    }

    function removeAlternative(alternative) {
      $scope.state.alternatives = _.reject($scope.state.alternatives, ['id', alternative.id]);
    }

    function removeDataSource(criterion, dataSource) {
      criterion.dataSources = _.reject(criterion.dataSources, ['id', dataSource.id]);
      checkForUnknownCriteria($scope.state.criteria);
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

    // private functions
    function initState() {
      if ($stateParams.workspace) {
        // copying existing workspace
        var oldWorkspace = SchemaService.updateWorkspaceToCurrentSchema($stateParams.workspace);
        $scope.state = {
          oldWorkspace: oldWorkspace,
          useFavorability: oldWorkspace.problem.valueTree ? true : false,
          step: 'step1',
          isInputDataValid: false,
          description: oldWorkspace.problem.description,
          criteria: ManualInputService.copyWorkspaceCriteria(oldWorkspace),
          alternatives: _.map(oldWorkspace.problem.alternatives, function(alternative, alternativeId) {
            return _.extend({}, alternative, {
              id: generateUuid(),
              oldId: alternativeId
            });
          })
        };
        $scope.state.inputData = ManualInputService.createInputFromOldWorkspace($scope.state.criteria,
          $scope.state.alternatives, $scope.state.oldWorkspace);
        checkForUnknownCriteria($scope.state.criteria);
        favorabilityChanged();
        $scope.dirty = true;
        setStateWatcher();
      } else if (!$stateParams.inProgressId) {
        // new workspace
        $scope.state = {
          step: 'step1',
          isInputDataValid: false,
          useFavorability: false,
          criteria: [],
          alternatives: []
        };
        setStateWatcher();
      } else {
        // unfinished workspace
        InProgressResource.get($stateParams).$promise.then(function(response) {
          $scope.state = response.state;
          checkForUnknownCriteria($scope.state.criteria);
          checkInputData();
          favorabilityChanged();
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

    function sortCriteria() {
      $scope.state.criteria = _.sortBy($scope.state.criteria, function(criterion) {
        return !criterion.isFavorable;
      });
    }

    function checkForUnknownCriteria(criteria) {
      $scope.hasUnknownInputType = _.find(criteria, function(criterion) {
        return _.find(criterion.dataSources, ['inputType', 'Unknown']);
      });
    }

    function swap(array, idx, newIdx) {
      var mem = array[idx];
      array[idx] = array[newIdx];
      array[newIdx] = mem;
    }
  };
  return dependencies.concat(ManualInputController);
});
