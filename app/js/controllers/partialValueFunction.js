'use strict';
define(['mcda/config', 'mcda/controllers/helpers/wizard', 'angular', 'underscore'],
  function(Config, Wizard, angular, _) {
    return function($scope, $state, $injector, PartialValueFunction, TaskDependencies, PataviService) {

      $scope.showMacbethError = false;

      $scope.openWizard = function() {
        $scope.pvfWizardStep = {
          step: 'elicit type'
        };
        $scope.createCriterionCache();
        $scope.definePVFModal.open();
      };

      $scope.createCriterionCache = function() {
        $scope.criterionCache = {
          direction: $scope.criterion.pvf.direction,
          type: $scope.criterion.pvf.type,
          cutoffs: angular.copy($scope.criterion.pvf.cutoffs),
          values: $scope.criterion.pvf.values
        };
      };

      $scope.save = function() {
        var standardizedState = standardize($scope.scenario.state, $scope.criterion),
          pvfTask = TaskDependencies.definitions['criteria-trade-offs'];

        $scope.scenario.state = _.pick(standardizedState, ['problem', 'prefs']);
        $scope.scenario.$save(function(scenario) {
          PartialValueFunction.attach(scenario.state);
          $scope.graphInfo.values = PartialValueFunction.getXY($scope.criterion);
          $scope.criterionCache.direction = $scope.criterion.pvf.direction;
          $scope.criterionCache.type = $scope.criterion.pvf.type;
          $scope.scenario.state = pvfTask.remove($scope.scenario.state);
          $scope.definePVFModal.close();
        });


      };

      $scope.canSave = function(state) {
        if (!state) {
          return false;
        }
        var criteria = _.keys(state.problem.criteria).sort();
        var criterion = getNextPiecewiseLinear(criteria, state);
        return state.choice.subType !== 'elicit cutoffs' && !criterion;
      };

      $scope.$on('closeCancelModal', function() {
        $scope.criterion.pvf.direction = $scope.criterionCache.direction;
        $scope.criterion.pvf.type = $scope.criterionCache.type;
        $scope.criterion.pvf.cutoffs = angular.copy($scope.criterionCache.cutoffs);
        $scope.criterion.pvf.values = $scope.criterionCache.values;
        $scope.graphInfo.values = PartialValueFunction.getXY($scope.criterion);
      });

      var standardize = function(state, criterion) {
        var localCriterion = state.problem.criteria[criterion.id];
        localCriterion.pvf = criterion.pvf;
        if (criterion.pvf.type === 'linear') {
          criterion.pvf.values = [];
        }
        return state;
      };

      $scope.isScaleRangePresent = function() {
        return $scope.criterion.pvf && $scope.criterion.pvf.range;
      };

      var rewritePreferences = function() {
        return _.map($scope.criterion.preferences, function(row) {
          return _.map(row, function(cell) {
            return cell ? cell.level : null;
          });
        });
      };

      $scope.calculate = function() {
        var preferences = rewritePreferences();
        var task = PataviService.run({
          method: 'macbeth',
          preferences: preferences
        });
        $scope.showMacbethError = {
          show: false
        };

        task.then(function(results) {
          console.log('result');
          var values = _.clone(results.results);
          $scope.criterion.pvf.values = values.slice(1, values.length - 1);
          $scope.graphInfo.values = PartialValueFunction.getXY($scope.criterion);
          $scope.$apply();
        }, function(code, error) {
          console.error('error');
          $scope.showMacbethError.show = true;
          $scope.$apply();
        });
      };


      var initialize = function(state) {

        function pluckObject(obj, field) {
          return _.object(_.map(_.pairs(obj), function(el) {
            return [el[0], el[1][field]];
          }));
        }

        var initial = {
          choice: {
            data: pluckObject(state.problem.criteria, 'pvf')
          }
        };
        return _.extend(state, initial);
      };

      $scope.validChoice = function() {
        if ($scope.pvfWizardStep.step === 'elicit values') {
          return $scope.criterion.pvf.cutoffs.length > 0;
        }
        return true;
      };

      var getNextPiecewiseLinear = function(criteria, state) {
        return _.find(criteria, function(c) {
          var choice = state.choice.data[c];
          return choice && choice.type === 'piecewise-linear' && !choice.cutoffs;
        });
      };

      $scope.addCutoff = function(cutoff) {
        var criterion = $scope.criterion;
        if (!criterion.pvf.cutoffs) {
          criterion.pvf.cutoffs = [];
        }
        criterion.pvf.cutoffs.push(cutoff);
        criterion.pvf.cutoffs.sort(function(a, b) {
          return criterion.pvf.direction === 'decreasing' ? a - b : b - a;
        });
      };

      $scope.validCutoff = function(cutoff) {
        var criterion = $scope.criterion;
        var allowed = (cutoff < criterion.best() && cutoff > criterion.worst()) || (cutoff < criterion.worst() && cutoff > criterion.best());
        var unique = criterion.pvf.cutoffs.indexOf(cutoff) === -1;
        return allowed && unique;
      };

      $scope.goToElicitCutoffsStep = function() {
        if (!$scope.criterion.pvf.cutoffs) {
          $scope.criterion.pvf.cutoffs = [];
        }
        $scope.pvfWizardStep.step = 'elicit cutoffs';
      };

      $scope.preferenceOptions = [{
        label: 'Very Weakly',
        level: 1
      }, {
        label: 'Weakly',
        level: 2
      }, {
        label: 'Moderately',
        level: 3
      }, {
        label: 'Strongly',
        level: 4
      }, {
        label: 'Very Strongly',
        level: 5
      }, {
        label: 'Extremely',
        level: 6
      }];

      $scope.goToElicitValuesStep = function() {
        var cutoffs = $scope.criterion.pvf.cutoffs,
          size = cutoffs.length + 2,
          criterion = $scope.criterion;

        $scope.showMacbethError = false;
        // Initialize preference matrix
        criterion.preferences = [];
        for (var i = 0; i < size; ++i) {
          criterion.preferences[i] = [];
          for (var j = 0; j < size; ++j) {
            criterion.preferences[i][j] = i === j ? $scope.preferenceOptions[0] : null;
          }
        }

        // Generate comparator lists
        var tmp = [$scope.criterion.best()].concat(cutoffs || []).concat([$scope.criterion.worst()]);
        criterion.base = tmp.slice(0, tmp.length - 1);
        criterion.comp = [];
        for (i = 0; i < tmp.length - 1; ++i) {
          criterion.comp[i] = tmp.slice(i + 1, tmp.length);
        }

        $scope.pvfWizardStep.step = 'elicit values';
      };

      $scope.isPVFDefined = function(criterion) {
        return criterion.pvf && criterion.pvf.type;
      };

      $injector.invoke(Wizard, this, {
        $scope: $scope,
        handler: {
          fields: ['type', 'choice', 'title'],
          hasIntermediateResults: false,
          initialize: _.partial(initialize, $scope.scenario.state),
          standardize: _.identity
        }
      });
    };
  });