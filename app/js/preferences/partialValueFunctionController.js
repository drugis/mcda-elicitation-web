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
    $scope.getXY = _.memoize(PartialValueFunctionService.getXY, function(arg) {
      return angular.toJson(arg.pvf);
    });

    // init
    $scope.pvf = PartialValueFunctionService;
    var aggregateProblem = $scope.aggregateState.problem;

    function initialize(state) {
      var criterionId = $stateParams.criterion.replace('%3A', ':'); // workaround: see https://github.com/angular-ui/ui-router/issues/2598
      var criterion = _.cloneDeep(aggregateProblem.criteria[criterionId]);
      if (!criterion) {
        return {};
      }
      PageTitleService.setPageTitle('PartialValueFunctionController', criterion.title + '\'s partial value function');
      // set defaults
      criterion.dataSources[0].pvf = !criterion.dataSources[0].pvf ? {} : criterion.dataSources[0].pvf;
      criterion.dataSources[0].pvf.direction = 'decreasing';
      criterion.dataSources[0].pvf.type = 'linear';
      criterion.dataSources[0].pvf.cutoffs = undefined;
      criterion.dataSources[0].pvf.values = undefined;

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

    function nextState(state) {
      var nextState = _.cloneDeep(state);
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
            }
          }
        });
      }
      return nextState;
    }

    function save(state) {
      var criterionId = $stateParams.criterion.replace('%3A', ':'); // workaround: see https://github.com/angular-ui/ui-router/issues/2598
      var standardizedDataSource = PartialValueFunctionService.standardizeDataSource(state.choice);
      var criteria = _.cloneDeep(aggregateProblem.criteria);
      criteria[criterionId].dataSources[0] = standardizedDataSource;
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

    $injector.invoke(Wizard, this, {
      $scope: $scope,
      handler: {
        fields: ['type', 'choice', 'bisections', 'ref'],
        validChoice: isValid,
        nextState: nextState,
        initialize: _.partial(initialize, taskDefinition.clean(currentScenario.state)),
        standardize: _.identity
      }
    });
  };
  return dependencies.concat(PartialValueFunctionController);
});
