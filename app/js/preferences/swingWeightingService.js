'use strict';
define(['lodash', 'angular', '..//controllers/wizard'], function (
  _,
  angular,
  Wizard
) {
  var dependencies = [
    '$state',
    '$injector',
    '$timeout',
    'PartialValueFunctionService',
    'PreferencesService',
    'OrderingService',
    'WorkspaceSettingsService'
  ];
  var SwingWeightingService = function (
    $state,
    $injector,
    $timeout,
    PartialValueFunctionService,
    PreferencesService,
    OrderingService,
    WorkspaceSettingsService
  ) {
    function initWeightingScope(
      scope,
      $stateParams,
      currentScenario,
      taskDefinition,
      sliderOptions,
      getValues,
      baseTitle,
      toBackEnd,
      canSaveArg
    ) {
      // functions
      scope.canSave = canSaveArg || canSave;
      scope.save = save;
      scope.saveImprecise = saveImprecise;
      scope.cancel = cancel;

      // init
      scope.pvf = PartialValueFunctionService;
      scope.$on('elicit.settingsChanged', function () {
        resetWizard();
      });
      scope.scalesPromise.then(resetWizard);

      function resetWizard() {
        var state = WorkspaceSettingsService.usePercentage()
          ? scope.aggregateState.percentified
          : scope.aggregateState.dePercentified;
        $state.problem = state.problem;
        OrderingService.getOrderedCriteriaAndAlternatives(
          state.problem,
          $stateParams
        ).then(function (orderings) {
          scope.alternatives = orderings.alternatives;
          scope.criteria = _(orderings.criteria).map(setBestAndWorst).value();

          $injector.invoke(Wizard, undefined, {
            $scope: scope,
            handler: {
              validChoice: validChoice,
              fields: ['total', 'mostImportantCriterionId', 'step'],
              nextState: nextState,
              standardize: _.identity,
              initialize: _.partial(initialize, taskDefinition.clean(state))
            }
          });
        });
      }

      function setBestAndWorst(criterion) {
        return _.extend({}, criterion, {
          best: PartialValueFunctionService.best(criterion.dataSources[0]),
          worst: PartialValueFunctionService.worst(criterion.dataSources[0])
        });
      }

      function title(step, total) {
        return baseTitle + ' (' + step + '/' + total + ')';
      }

      function initialize(state) {
        state = _.extend(state, {
          title: title(1, 2),
          step: 1,
          total: 2
        });
        return state;
      }

      function validChoice(state) {
        if (!state) {
          return false;
        }
        return state.mostImportantCriterionId;
      }

      function nextState(state) {
        if (!validChoice(state)) {
          return null;
        }

        var next = {
          step: state.step + 1,
          values: getValues(state.problem.criteria),
          mostImportantWeight: 100,
          sliderOptions: sliderOptions,
          sliderOptionsDisabled: {
            disabled: true,
            floor: 1,
            ceil: 100,
            translate: function (value) {
              return value + '%';
            }
          }
        };
        $timeout(function () {
          scope.$broadcast('rzSliderForceRender');
        }, 100);

        next.title = title(next.step, state.total);
        return _.extend(angular.copy(state), next);
      }

      function canSave(state) {
        return state && state.step === 2;
      }

      function save(prefs) {
        const newProblem = _.extend({}, $state.problem, {
          preferences: prefs
        });
        PreferencesService.getWeights(newProblem).then((result) => {
          currentScenario.state = {
            problem: currentScenario.state.problem,
            prefs: prefs,
            weights: result
          };
          currentScenario.$save($stateParams, function (scenario) {
            scope.$emit('elicit.resultsAccessible', scenario);
            $state.go('preferences');
          });
        });
      }

      function saveImprecise(state) {
        var prefs = _(state.values)
          .omit(state.mostImportantCriterionId)
          .map(toBackEnd(state.mostImportantCriterionId))
          .value();
        const newProblem = _.extend({}, state.problem, {
          preferences: prefs
        });
        PreferencesService.getWeights(newProblem).then((result) => {
          currentScenario.state = {
            problem: currentScenario.state.problem,
            prefs: prefs,
            weights: result
          };
          currentScenario.$save($stateParams, function (scenario) {
            scope.$emit('elicit.resultsAccessible', scenario);
            $state.go('preferences');
          });
        });
      }

      function cancel() {
        $state.go('preferences');
      }
    }

    return {
      initWeightingScope: initWeightingScope
    };
  };
  return dependencies.concat(SwingWeightingService);
});
