'use strict';
define([
  'lodash',
  'angular',
  'jquery'
], function(
  _,
  angular,
  $
) {
  var dependencies = [
    '$scope',
    '$state',
    '$stateParams',
    '$transitions',
    '$timeout',
    '$modal',
    'EffectsTableService',
    'InProgressResource',
    'ManualInputService',
    'OrderingService',
    'PageTitleService',
    'SchemaService',
    'WorkspaceResource',
    'generateUuid',
    'swap'
  ];
  var ManualInputController = function(
    $scope,
    $state,
    $stateParams,
    $transitions,
    $timeout,
    $modal,
    EffectsTableService,
    InProgressResource,
    ManualInputService,
    OrderingService,
    PageTitleService,
    SchemaService,
    WorkspaceResource,
    generateUuid,
    swap
  ) {
    // functions
    $scope.addAlternative = addAlternative;
    $scope.alternativeDown = alternativeDown;
    $scope.alternativeUp = alternativeUp;
    $scope.checkInputData = checkInputData;
    $scope.createProblem = createProblem;
    $scope.goToStep1 = goToStep1;
    $scope.goToStep2 = goToStep2;
    $scope.removeAlternative = removeAlternative;
    $scope.saveInProgress = saveInProgress;
    $scope.openCriterionModal = openCriterionModal;
    $scope.generateDistributions = generateDistributions;
    $scope.editAlternative = editAlternative;

    // init
    $scope.alternativeInput = {}; //scoping
    $scope.editMode = {
      isUserOwner: true
    };
    PageTitleService.setPageTitle('ManualInputController', 'Manual input');
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

    function alternativeDown(idx) {
      swap($scope.state.alternatives, idx, idx + 1);
    }

    function alternativeUp(idx) {
      swap($scope.state.alternatives, idx, idx - 1);
    }

    function checkInputData() {
      if ($scope.state.inputData) {
        $scope.state.step2errors = [];
        $scope.state.step2warnings = [];

        var isEffectDataValid = !ManualInputService.findInvalidCell($scope.state.inputData.effect);
        var isDistributionDataValid = !ManualInputService.findInvalidCell($scope.state.inputData.distribution);

        if (isEffectDataValid && !isDistributionDataValid) {
          $scope.state.step2warnings.push('SMAA tab contains invalid inputs which will not be used, Deterministic inputs for those cells will be used instead');
        }

        if (!isEffectDataValid && isDistributionDataValid) {
          $scope.state.step2warnings.push('Deterministic tab contains invalid inputs which will not be used, SMAA inputs for those cells will be used instead');
        }

        if (!isEffectDataValid && !isDistributionDataValid) {
          $scope.state.step2errors.push('Both tabs contain missing or invalid inputs');
        }
      }
    }

    function createProblem() {
      var problem = ManualInputService.createProblem($scope.state.criteria, $scope.state.alternatives,
        $scope.state.title, $scope.state.description, $scope.state.inputData, $scope.state.useFavorability);
      WorkspaceResource.create(problem).$promise.then(function(workspace) {
        if ($stateParams.inProgressId) {
          InProgressResource.delete($stateParams);
        }
        createOrdering(workspace);
      });
      return problem;
    }

    function createOrdering(workspace) {
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
    }

    function goToStep1() {
      $scope.state.step = 'step1';
    }

    function goToStep2() {
      $scope.state.step = 'step2';
      if (!$scope.state.currentTab) {
        $scope.state.currentTab = 'effect';
      }
      $scope.criteriaRows = EffectsTableService.buildTableRows($scope.state.criteria);
      $scope.state.inputData = ManualInputService.prepareInputData(
        $scope.state.criteria, $scope.state.alternatives, $scope.state.inputData
      );
      $timeout(checkInputData);
    }


    function removeAlternative(alternative) {
      $scope.state.alternatives = _.reject($scope.state.alternatives, ['id', alternative.id]);
    }

    function saveInProgress() {
      hideTooltip();
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

    function hideTooltip() {
      $('div.tooltip:visible').hide();
      $('#step1-save-button').removeClass('open');
      $('#step2-save-button').removeClass('open');
    }

    function openCriterionModal() {
      $modal.open({
        templateUrl: '../evidence/editCriterion.html',
        controller: 'AddCriterionController',
        resolve: {
          criteria: function() {
            return $scope.state.criteria;
          },
          callback: function() {
            return function(newCriterion) {
              $scope.state.criteria.push(newCriterion);
            };
          },
          oldCriterion: function() {
            return undefined;
          },
          useFavorability: function() {
            return $scope.state.useFavorability;
          }
        }
      });
    }

    function addAlternative() {
      $modal.open({
        templateUrl: './addAlternative.html',
        controller: 'AddAlternativeController',
        size: 'tiny',
        resolve: {
          alternatives: function() {
            return $scope.state.alternatives;
          },
          callback: function() {
            return function(title) {
              $scope.state.alternatives.push({
                title: title,
                id: generateUuid()
              });
            };
          }
        }
      });
    }

    function generateDistributions() {
      var answer = confirm('Generating distribution parameters for SMAA will overwrite any existing values in the SMAA tab.');
      if (answer) {
        $scope.state.inputData.distribution = ManualInputService.generateDistributions($scope.state.inputData);
        checkInputData();
        $scope.state.currentTab = 'distribution';
      }
    }

    function initState() {
      if ($stateParams.workspace) {
        copyOldWorkspace();
      } else if (!$stateParams.inProgressId) {
        createNewWorkSpace();
      } else {
        loadUnfinishedWorkspace();
      }
    }

    function copyOldWorkspace() {
      var updatedWorkspace = SchemaService.updateWorkspaceToCurrentSchema($stateParams.workspace);
      SchemaService.validateProblem(updatedWorkspace.problem);
      $scope.state = ManualInputService.createStateFromOldWorkspace(updatedWorkspace);
      $scope.dirty = true;
      setStateWatcher();
      checkStep1Errors();
    }

    function createNewWorkSpace() {
      $scope.state = {
        step: 'step1',
        isInputDataValid: false,
        useFavorability: false,
        criteria: [],
        alternatives: []
      };
      setStateWatcher();
    }

    function loadUnfinishedWorkspace() {
      InProgressResource.get($stateParams).$promise.then(function(response) {
        $scope.state = response.state;
        if ($scope.state.step === 'step2') {
          $scope.criteriaRows = EffectsTableService.buildTableRows($scope.state.criteria);
          if (!$scope.state.inputData.effect && !$scope.state.inputData.distribution) {
            $scope.state.inputData = ManualInputService.prepareInputData($scope.state.criteria, $scope.state.alternatives,
              $scope.state.inputData);
          }
        }
        checkInputData();
        setStateWatcher();
        checkStep1Errors();
      });
    }

    function setStateWatcher() {
      $scope.$watch('state', function(newValue, oldValue) {
        if (!angular.equals(newValue, oldValue)) {
          $scope.dirty = true;
          checkStep1Errors();
        }
      }, true);
    }

    function checkStep1Errors() {
      if ($scope.state.step === 'step1') {
        $scope.state.step1errors = ManualInputService.checkStep1Errors($scope.state);
      }
    }

    function editAlternative(alternative) {
      $modal.open({
        template: require('../evidence/editAlternative.html'),
        controller: 'EditAlternativeController',
        resolve: {
          alternative: function() {
            return alternative;
          },
          alternatives: function() {
            return $scope.state.alternatives;
          },
          callback: function() {
            return function(newAlternative) {
              $scope.state.alternatives[_.findIndex($scope.state.alternatives, ['id', alternative.id])] = newAlternative;
            };
          }
        }
      });
    }

  };
  return dependencies.concat(ManualInputController);
});
