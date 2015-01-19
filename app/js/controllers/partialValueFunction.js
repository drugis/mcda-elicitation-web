'use strict';
define(['mcda/config', 'mcda/controllers/helpers/wizard', 'angular', 'underscore'],
  function(Config, Wizard, angular, _) {
    return function($scope, $state, $stateParams, $injector, currentScenario, PartialValueFunction, TaskDependencies, MCDAPataviService) {

      $scope.criterion = currentScenario.state.problem.criteria[$stateParams.criterion];
      $scope.pvfWizardStep = { step: 'elicit type' };

      $scope.save = function() {
        var standardizedState = standardize($scope.scenario.state, $scope.criterion);

        $scope.scenario.state = _.pick(standardizedState, ['problem', 'prefs']);
        PartialValueFunction.attach($scope.scenario.state);

        $scope.scenario.$save($stateParams, function() {
          $scope.$emit('elicit.partialValueFunctionChanged');
          PartialValueFunction.attach($scope.scenario.state);
          $state.go('preferences');
        });
      };

      $scope.canSave = function(state) {
        return !state;
      };

      var standardize = function(state, criterion) {
        var localCriterion = state.problem.criteria[criterion.id];
        localCriterion.pvf = criterion.pvf;
        if (criterion.pvf.type === 'linear') {
          criterion.pvf.values = [];
          criterion.pvf.cutoffs = [];
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
        var task = MCDAPataviService.run({
          method: 'macbeth',
          preferences: preferences
        });

        task.then(function(results) {
          var values = _.clone(results.results);
          $scope.criterion.pvf.values = values.slice(1, values.length - 1);
        }, function() {
          console.error('error');
        });
      };


      var initialize = function(state) {
        var pluckObject = function(obj, field) {
          return _.object(_.map(_.pairs(obj), function(el) {
            return [el[0], el[1][field]];
          }));
        };

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
        PartialValueFunction.attach($scope.scenario.state);
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

        // calculate consistency
        $scope.calculate();

        $scope.pvfWizardStep.step = 'elicit values';
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
