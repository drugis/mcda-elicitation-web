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

    function editDataSource(criterion, oldDataSource) {
      $modal.open({
        templateUrl: '/js/manualInput/addDataSource.html',
        controller: 'AddDataSourceController',
        resolve: {
          callback: function() {
            return function(newDataSource) {
              var crit = _.find($scope.state.criteria, ['id', criterion.id]);
              if (oldDataSource) {
                crit.dataSources[_.findIndex(crit.dataSources, function(dataSource) {
                  return dataSource.id === newDataSource.id;
                })] = newDataSource;
              } else {
                crit.dataSources.push(newDataSource);
              }
              updateCriteriaRows();
            };
          },
          criterion: function() {
            return _.find($scope.state.criteria, ['id', criterion.id]);
          },
          oldDataSource: function() {
            return oldDataSource;
          }
        }
      });
    }

    function updateCriteriaRows() {
      $scope.criteriaRows = EffectsTableService.buildTableRows($scope.state.criteria);
    }

    function canCriterionGoUp(criterion) {
      var index = _.findIndex($scope.state.criteria, ['id', criterion.id]);
      return index !== 0 &&
        (!$scope.state.useFavorability ||
          (criterion.isFavorable === $scope.state.criteria[index - 1].isFavorable));
    }

    function canCriterionGoDown(criterion) {
      var index = _.findIndex($scope.state.criteria, ['id', criterion.id]);
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
      var mem = $scope.state.alternatives[idx];
      $scope.state.alternatives[idx] = $scope.state.alternatives[idx + 1];
      $scope.state.alternatives[idx + 1] = mem;
    }

    function alternativeUp(idx) {
      var mem = $scope.state.alternatives[idx];
      $scope.state.alternatives[idx] = $scope.state.alternatives[idx - 1];
      $scope.state.alternatives[idx - 1] = mem;
    }

    function criterionDown(criterionId) {
      var idx = _.findIndex($scope.state.criteria, ['id', criterionId]);
      var mem = $scope.state.criteria[idx];
      $scope.state.criteria[idx] = $scope.state.criteria[idx + 1];
      $scope.state.criteria[idx + 1] = mem;
      updateCriteriaRows();
    }

    function criterionUp(criterionId) {
      var idx = _.findIndex($scope.state.criteria, ['id', criterionId]);
      var mem = $scope.state.criteria[idx];
      $scope.state.criteria[idx] = $scope.state.criteria[idx - 1];
      $scope.state.criteria[idx - 1] = mem;
      updateCriteriaRows();
    }

    function dataSourceDown(row) {
      moveDataSource(row, 'down');
    }

    function dataSourceUp(row) {
      moveDataSource(row, 'up');
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
              updateCriteriaRows();
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
      updateCriteriaRows();
    }

    function removeAlternative(alternative) {
      $scope.state.alternatives = _.reject($scope.state.alternatives, ['id', alternative.id]);
    }

    function removeDataSource(row) {
      var criterion = _.find($scope.state.criteria, function(criterion) {
        return criterion.id === row.criterion.id;
      });
      criterion.dataSources = _.reject(criterion.dataSources, ['id', row.dataSource.id]);
      checkForUnknownCriteria($scope.state.criteria);
      favorabilityChanged();
      updateCriteriaRows();
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
        updateCriteriaRows();
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
        updateCriteriaRows();
      } else {
        // unfinished workspace
        InProgressResource.get($stateParams).$promise.then(function(response) {
          $scope.state = response.state;
          checkForUnknownCriteria($scope.state.criteria);
          checkInputData();
          favorabilityChanged();
          setStateWatcher();
          updateCriteriaRows();
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
      updateCriteriaRows();
    }

    function checkForUnknownCriteria(criteria) {
      $scope.hasUnknownInputType = _.find(criteria, function(criterion) {
        return _.find(criterion.dataSources, ['inputType', 'Unknown']);
      });
    }

    function moveDataSource(row, direction) {
      var criterion = _.find($scope.state.criteria, function(criterion) {
        return criterion.id === row.criterion.id;
      });
      var idx = _.findIndex(criterion.dataSources, function(dataSource) {
        return dataSource.id === row.dataSource.id;
      });
      var newIdx = direction === 'up' ? idx - 1 : idx + 1;
      var mem = criterion.dataSources[idx];
      criterion.dataSources[idx] = criterion.dataSources[newIdx];
      criterion.dataSources[newIdx] = mem;
      updateCriteriaRows();
    }
  };
  return dependencies.concat(ManualInputController);
});
