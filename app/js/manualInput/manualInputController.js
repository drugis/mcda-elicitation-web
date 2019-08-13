'use strict';
define(['lodash', 'angular', 'jquery'], function(_, angular, $) {
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

    // init
    $scope.alternativeInput = {}; //scoping
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
        $scope.state.errors = [];
        $scope.state.warnings = [];

        var isEffectDataValid = !ManualInputService.findInvalidCell($scope.state.inputData.effect);
        var isDistributionDataValid = !ManualInputService.findInvalidCell($scope.state.inputData.distribution);

        if (isEffectDataValid && !isDistributionDataValid) {
          $scope.state.warnings.push('SMAA tab contains invalid inputs which will not be used, Deterministic inputs for those cells will be used instead');
        }

        if (!isEffectDataValid && isDistributionDataValid) {
          $scope.state.warnings.push('Deterministic tab contains invalid inputs which will not be used, SMAA inputs for those cells will be used instead');
        }

        if (!isEffectDataValid && !isDistributionDataValid) {
          $scope.state.errors.push('Both tabs contain missing or invalid inputs');
        }

        if (ManualInputService.findDuplicateValues($scope.state.inputData.effect)) {
          $scope.state.errors.push('Deterministic tab contains a row with duplicate inputs');
        }

        if (ManualInputService.findDuplicateValues($scope.state.inputData.distribution)) {
          $scope.state.errors.push('Distribution tab contains a row with duplicate inputs');
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

    function goToStep1() {
      $scope.state.step = 'step1';
    }

    function goToStep2() {
      $scope.state.step = 'step2';
      if (!$scope.state.currentTab) {
        $scope.state.currentTab = 'effect';
      }
      $scope.criteriaRows = EffectsTableService.buildTableRows($scope.state.criteria);
      $scope.state.inputData = ManualInputService.prepareInputData($scope.state.criteria, $scope.state.alternatives,
        $scope.state.inputData);
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
      $('#step1SaveButton').removeClass('open');
      $('#step2SaveButton').removeClass('open');
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
        size:'small',
        resolve: {
          alternatives: function(){
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
      $scope.state = ManualInputService.createStateFromOldWorkspace(
        SchemaService.updateWorkspaceToCurrentSchema($stateParams.workspace));
      $scope.dirty = true;
      setStateWatcher();
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
      });
    }

    function setStateWatcher() {
      $scope.$watch('state', function(newValue, oldValue) {
        if (!angular.equals(newValue, oldValue)) {
          $scope.dirty = true;
        }
      }, true);
    }
  };
  return dependencies.concat(ManualInputController);
});
