'use strict';
define(['angular', 'lodash', '../controllers/wizard'], function(angular, _, Wizard) {
  var dependencies = [
    '$scope',
    '$timeout',
    '$state',
    '$stateParams',
    '$injector',
    'currentScenario',
    'taskDefinition',
    'PartialValueFunctionService',
    'PageTitleService',
    'numberFilter'
  ];

  var PartialValueFunctionController = function(
    $scope,
    $timeout,
    $state,
    $stateParams,
    $injector,
    currentScenario,
    taskDefinition,
    PartialValueFunctionService,
    PageTitleService,
    numberFilter
  ) {
    // functions
    $scope.save = save;
    $scope.canSave = canSave;
    $scope.cancel = cancel;
    $scope.updatePlot = updatePlot;
    // init
    $scope.pvf = PartialValueFunctionService;
    var aggregateProblem = $scope.aggregateState.problem;
    $scope.$on('elicit.settingsChanged', function() {
      aggregateProblem = $scope.aggregateState.problem;
      resetWizard();
    });

    resetWizard();

    function updatePlot(criterion) {
      $scope.pvfCoordinates = PartialValueFunctionService.getPvfCoordinatesForCriterion(criterion);
    }

    function initialize(state) {
      var criterionId = $stateParams.criterion.replace('%3A', ':'); // workaround: see https://github.com/angular-ui/ui-router/issues/2598
      var criterion = angular.copy(aggregateProblem.criteria[criterionId]);
      if (!criterion) {
        return {};
      }
      $scope.unitOfMeasurement = getUnitOfMeasurement(criterion);
      PageTitleService.setPageTitle('PartialValueFunctionController', criterion.title + '\'s partial value function');
      // set defaults
      criterion.dataSources[0].pvf = criterion.dataSources[0].pvf ? criterion.dataSources[0].pvf : {};
      criterion.dataSources[0].pvf.direction = 'decreasing';
      criterion.dataSources[0].pvf.type = 'linear';
      criterion.dataSources[0].pvf.cutoffs = undefined;
      criterion.dataSources[0].pvf.values = undefined;
      updatePlot(criterion);

      var initial = {
        ref: 0,
        bisections: [
          [0, 1],
          [0, 0.5],
          [0.5, 1]
        ],
        type: 'elicit type',
        criterion: criterion,
        choice: criterion.dataSources[0]
      };
      $timeout(function() {
        $scope.$broadcast('rzSliderForceRender');
      }, 100);
      return _.extend(state, initial);
    }

    function getUnitOfMeasurement(criterion) {
      if (_.isEqual(criterion.dataSources[0].scale, [0, 1])) {
        return '';
      }
      if (_.isEqual(criterion.dataSources[0].scale, [0, 100])) {
        return ' %';
      }
      if (criterion.unitOfMeasurement) {
        return ' ' + criterion.unitOfMeasurement;
      }
      return '';
    }

    function nextState(state) {
      var nextState = angular.copy(state);
      var ref = nextState.ref;

      if (state.type === 'elicit type') {
        nextState.type = 'bisection';
      }

      if (nextState.type === 'bisection') {
        if (ref === 0) {
          nextState.choice.pvf.values = [];
          nextState.choice.pvf.cutoffs = [];
        }

        var bisection = nextState.bisections[ref];
        var inv = PartialValueFunctionService.inv(nextState.choice);

        var from, to;
        if (nextState.choice.direction === 'increasing') {
          from = inv(bisection[1]);
          to = inv(bisection[0]);
        } else {
          from = inv(bisection[0]);
          to = inv(bisection[1]);
        }

        nextState.choice.pvf.values[ref] = (bisection[0] + bisection[1]) / 2;
        nextState.choice.pvf.cutoffs[ref] = (to + from) / 2;

        nextState = _.extend(nextState, {
          ref: ref + 1,
          range: {
            from: from,
            to: to
          },
          sliderOptions: {
            floor: Math.min(from, to),
            ceil: Math.max(from, to),
            precision: 10,
            step: Math.abs(to - from) / 100,
            rightToLeft: to < from,
            translate: function(value) {
              return numberFilter(value);
            },
            onChange: function() {
              updatePlot($scope.state.criterion);
            }
          }
        });
      }
      return nextState;
    }

    function save(state) {
      var criterionId = $stateParams.criterion.replace('%3A', ':'); // workaround: see https://github.com/angular-ui/ui-router/issues/2598
      var standardizedDataSource = PartialValueFunctionService.standardizeDataSource(state.choice);
      var criteria = currentScenario.state.problem ? angular.copy(currentScenario.state.problem.criteria) : {};
      criteria[criterionId] = {
        dataSources: [standardizedDataSource]
      };
      currentScenario.state = {
        prefs: {},
        problem: {
          criteria: criteria
        }
      };
      currentScenario.$save($stateParams, function(scenario) {
        $scope.$emit('elicit.resultsAccessible', scenario);
        $state.go('preferences');
      });
    }

    function canSave(state) {
      switch (state.type) {
        case 'elicit type':
          return state.choice.pvf.type === 'linear';
        case 'bisection':
          return state.ref === state.bisections.length;
        default:
          return false;
      }
    }

    function isValid(state) {
      switch (state.type) {
        case 'elicit type':
          return state.choice.pvf.type && state.choice.pvf.direction;
        case 'bisection':
          return true;
        default:
          return false;
      }
    }

    function cancel() {
      $state.go('preferences');
    }

    function resetWizard() {
      $injector.invoke(Wizard, {}, {
        $scope: $scope,
        handler: {
          fields: ['type', 'choice', 'bisections', 'ref', 'criterion'],
          validChoice: isValid,
          nextState: nextState,
          initialize: _.partial(initialize, taskDefinition.clean(currentScenario.state)),
          standardize: _.identity
        }
      });
    }
  };
  return dependencies.concat(PartialValueFunctionController);
});
