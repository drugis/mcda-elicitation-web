'use strict';
define(['angular',
    'angular-mocks',
    'mcda/services/taskDependencies',
    'mcda/services/util',
    'mcda/services/effectsTableService',
    'mcda/preferences/preferences'
  ],
  function() {
    describe('PartialValueFunctionServiceHandler', function() {
      var scope, state;

      beforeEach(module('elicit.preferences'));
      beforeEach(module('elicit.taskDependencies'));
      beforeEach(module('elicit.effectsTableService'));


      beforeEach(inject(function($rootScope, $controller, TaskDependencies) {
        var task = {
            requires: [],
            resets: []
          },
          scenario = {
            state: {
              problem: exampleProblem()
            },
            update: function() {},
            redirectToDefaultView: function() {}
          };

        scope = $rootScope.$new();
        state = jasmine.createSpyObj('$state', ['go']);
        scope.aggregateState = {
          problem: exampleProblem()
        };
        scope.scenario = scenario;
        scope.workspace = {
          problem: exampleProblem()
        };

        $controller('PartialValueFunctionController', {
          $scope: scope,
          $state: state,
          $stateParams: {},
          currentScenario: scenario,
          taskDefinition: TaskDependencies.extendTaskDefinition(task)
        });
      }));

      describe('Create Linear Partial Value function', function() {

        var crit1 = {
          pvf: {
            'type': 'linear',
            'direction': 'increasing',
            'range': [-0.15, 0.35]
          }
        };

        var crit2 = {
          pvf: {
            'type': 'linear',
            'direction': 'decreasing',
            'range': [50, 100]
          }
        };


        it('determines worst values', inject(function(PartialValueFunctionService) {
          expect(PartialValueFunctionService.worst(crit1)).toEqual(-0.15);
          expect(PartialValueFunctionService.worst(crit2)).toEqual(100);
        }));

        it('determines best values', inject(function(PartialValueFunctionService) {
          expect(PartialValueFunctionService.best(crit1)).toEqual(0.35);
          expect(PartialValueFunctionService.best(crit2)).toEqual(50);
        }));

        it('defines the partial value function', inject(function(PartialValueFunctionService) {
          expect(PartialValueFunctionService.map(crit1)(0.35)).toBeCloseTo(1.0);
          expect(PartialValueFunctionService.map(crit1)(-0.15)).toBeCloseTo(0.0);
          expect(PartialValueFunctionService.map(crit1)(0.1)).toBeCloseTo(0.5);

          expect(PartialValueFunctionService.map(crit2)(50)).toBeCloseTo(1.0);
          expect(PartialValueFunctionService.map(crit2)(100)).toBeCloseTo(0.0);
          expect(PartialValueFunctionService.map(crit2)(75)).toBeCloseTo(0.5);
        }));

        it('defines the inverse of the partial value function', inject(function(PartialValueFunctionService) {
          expect(PartialValueFunctionService.inv(crit1)(1.0)).toBeCloseTo(0.35);
          expect(PartialValueFunctionService.inv(crit1)(0.0)).toBeCloseTo(-0.15);
          expect(PartialValueFunctionService.inv(crit1)(0.5)).toBeCloseTo(0.1);

          expect(PartialValueFunctionService.inv(crit2)(1.0)).toBeCloseTo(50);
          expect(PartialValueFunctionService.inv(crit2)(0.0)).toBeCloseTo(100);
          expect(PartialValueFunctionService.inv(crit2)(0.5)).toBeCloseTo(75);
        }));
      });

      describe('Create Piecewise Partial Value function', function() {
        var crit1, crit2;

        crit1 = {
          pvf: {
            'type': 'piecewise-linear',
            'direction': 'increasing',
            'range': [-0.15, 0.35],
            'cutoffs': [0.0, 0.25],
            'values': [0.1, 0.9]
          }
        };
        crit2 = {
          pvf: {
            'type': 'piecewise-linear',
            'direction': 'decreasing',
            'range': [50, 100],
            'cutoffs': [75, 90],
            'values': [0.8, 0.5]
          }
        };

        it('determines worst values', inject(function(PartialValueFunctionService) {
          expect(PartialValueFunctionService.worst(crit1)).toEqual(-0.15);
          expect(PartialValueFunctionService.worst(crit2)).toEqual(100);
        }));

        it('determines best values', inject(function(PartialValueFunctionService) {
          expect(PartialValueFunctionService.best(crit1)).toEqual(0.35);
          expect(PartialValueFunctionService.best(crit2)).toEqual(50);
        }));

        it('defines the partial value function', inject(function(PartialValueFunctionService) {
          expect(PartialValueFunctionService.map(crit1)(0.35)).toBeCloseTo(1.0);
          expect(PartialValueFunctionService.map(crit1)(-0.15)).toBeCloseTo(0.0);
          expect(PartialValueFunctionService.map(crit1)(0.0)).toBeCloseTo(0.1);
          expect(PartialValueFunctionService.map(crit1)(0.25)).toBeCloseTo(0.9);
          expect(PartialValueFunctionService.map(crit1)(0.1)).toBeCloseTo(2 / 5 * 0.8 + 0.1);

          expect(PartialValueFunctionService.map(crit2)(50)).toBeCloseTo(1.0);
          expect(PartialValueFunctionService.map(crit2)(60)).toBeCloseTo(1 - (2 / 5 * 0.2));
          expect(PartialValueFunctionService.map(crit2)(75)).toBeCloseTo(0.8);
          expect(PartialValueFunctionService.map(crit2)(90)).toBeCloseTo(0.5);
          expect(PartialValueFunctionService.map(crit2)(100)).toBeCloseTo(0.0);
        }));

        it('defines the inverse of the partial value function', inject(function(PartialValueFunctionService) {
          expect(PartialValueFunctionService.inv(crit1)(1.0)).toBeCloseTo(0.35);
          expect(PartialValueFunctionService.inv(crit1)(0.0)).toBeCloseTo(-0.15);
          expect(PartialValueFunctionService.inv(crit1)(0.1)).toBeCloseTo(0.0);
          expect(PartialValueFunctionService.inv(crit1)(0.9)).toBeCloseTo(0.25);
          expect(PartialValueFunctionService.inv(crit1)(2 / 5 * 0.8 + 0.1)).toBeCloseTo(0.1);

          expect(PartialValueFunctionService.inv(crit2)(1.0)).toBeCloseTo(50);
          expect(PartialValueFunctionService.inv(crit2)(1 - 2 / 5 * 0.2)).toBeCloseTo(60);
          expect(PartialValueFunctionService.inv(crit2)(0.8)).toBeCloseTo(75);
          expect(PartialValueFunctionService.inv(crit2)(0.5)).toBeCloseTo(90);
          expect(PartialValueFunctionService.inv(crit2)(0.0)).toBeCloseTo(100);
        }));
      });

      describe('Piecwise Partial Value Functions map', function() {
        var crit = {
          pvf: {
            'type': 'piecewise-linear',
            'direction': 'increasing',
            'range': [4, 8],
            'cutoffs': [4.5, 5, 6.5],
            'values': [0.25, 0.5, 0.75]
          }
        };

        it('works for three cutoffs', inject(function(PartialValueFunctionService) {
          var map = PartialValueFunctionService.map(crit);
          expect(map(5)).toBeCloseTo(0.5);
        }));
      });

      describe('standardizeCriterion', function() {
        it('should sort the cutoffs and values of an piecewise-linear pvf', inject(function(PartialValueFunctionService) {
          var crit = {
            pvf: {
              'type': 'piecewise-linear',
              'direction': 'increasing',
              'cutoffs': [75, 7.5, 50],
              'values': [0.25, 0.5, 0.75]
            }
          };
          var result = PartialValueFunctionService.standardizeCriterion(crit);
          var expectedResult = {
            pvf: {
              'type': 'piecewise-linear',
              'direction': 'increasing',
              'cutoffs': [7.5, 50, 75],
              'values': [0.25, 0.5, 0.75]
            }
          };
          expect(result).toEqual(expectedResult);
        }));
        it('should sort the cutoffs and reverse-sort the values of an  decreasing piecewise-linear pvf', inject(function(PartialValueFunctionService) {
          var crit = {
            pvf: {
              'type': 'piecewise-linear',
              'direction': 'decreasing',
              'cutoffs': [75, 7.5, 50],
              'values': [0.25, 0.5, 0.75]
            }
          };
          var result = PartialValueFunctionService.standardizeCriterion(crit);
          var expectedResult = {
            pvf: {
              'type': 'piecewise-linear',
              'direction': 'decreasing',
              'cutoffs': [7.5, 50, 75],
              'values': [0.75, 0.5, 0.25]
            }
          };
          expect(result).toEqual(expectedResult);
        }));
        it('should delete the cutoffs and values, if any, from a linear pvf', inject(function(PartialValueFunctionService) {
          var crit = {
            pvf: {
              'type': 'linear',
              'cutoffs': [75, 7.5, 50],
              'values': [0.25, 0.5, 0.75]
            }
          };
          var result = PartialValueFunctionService.standardizeCriterion(crit);
          var expectedResult = {
            pvf: {
              'type': 'linear',
            }
          };
          expect(result).toEqual(expectedResult);
        }));
      });
    });
  });