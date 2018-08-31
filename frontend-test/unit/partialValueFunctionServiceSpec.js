'use strict';
define(['angular',
  'angular-mocks',
  'mcda/services/taskDependencies',
  'mcda/services/util',
  'mcda/evidence/evidence',
  'mcda/preferences/preferences'
],
  function(angular) {
    //FIXME: make a decent spec out of this stuff
    describe('PartialValueFunctionService', function() {
      var scope, state;

      beforeEach(angular.mock.module('elicit.preferences'));
      beforeEach(angular.mock.module('elicit.evidence'));
      beforeEach(angular.mock.module('elicit.taskDependencies'));

      beforeEach(inject(function($rootScope, $controller, TaskDependencies) {
        var task = {
          requires: [],
          resets: []
        },
          scenario = {
            state: {
              problem: exampleProblem()
            },
            update: function() { },
            redirectToDefaultView: function() { }
          };
        var pageTitleServiceMock = jasmine.createSpyObj('PageTitleService', ['getPageTitle']);

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
          $stateParams: {
            criterion: 'foo'
          },
          currentScenario: scenario,
          taskDefinition: TaskDependencies.extendTaskDefinition(task),
          PageTitleService: pageTitleServiceMock
        });
      }));

      describe('Create Linear Partial Value function', function() {
        var crit1 = {
          dataSources: [{
            pvf: {
              'type': 'linear',
              'direction': 'increasing',
              'range': [-0.15, 0.35]
            }
          }]
        };
        var crit2 = {
          dataSources: [{
            pvf: {
              'type': 'linear',
              'direction': 'decreasing',
              'range': [50, 100]
            }
          }]
        };

        it('determines worst values', inject(function(PartialValueFunctionService) {
          expect(PartialValueFunctionService.worst(crit1.dataSources[0])).toEqual(-0.15);
          expect(PartialValueFunctionService.worst(crit2.dataSources[0])).toEqual(100);
        }));

        it('determines best values', inject(function(PartialValueFunctionService) {
          expect(PartialValueFunctionService.best(crit1.dataSources[0])).toEqual(0.35);
          expect(PartialValueFunctionService.best(crit2.dataSources[0])).toEqual(50);
        }));

      });

      describe('Create Piecewise Partial Value function', function() {
        var crit1, crit2;

        crit1 = {
          dataSources: [{
            pvf: {
              'type': 'piecewise-linear',
              'direction': 'increasing',
              'range': [-0.15, 0.35],
              'cutoffs': [0.0, 0.25],
              'values': [0.1, 0.9]
            }
          }]
        };
        crit2 = {
          dataSources: [{
            pvf: {
              'type': 'piecewise-linear',
              'direction': 'decreasing',
              'range': [50, 100],
              'cutoffs': [75, 90],
              'values': [0.8, 0.5]
            }
          }]
        };

        it('determines worst values', inject(function(PartialValueFunctionService) {
          expect(PartialValueFunctionService.worst(crit1.dataSources[0])).toEqual(-0.15);
          expect(PartialValueFunctionService.worst(crit2.dataSources[0])).toEqual(100);
        }));

        it('determines best values', inject(function(PartialValueFunctionService) {
          expect(PartialValueFunctionService.best(crit1.dataSources[0])).toEqual(0.35);
          expect(PartialValueFunctionService.best(crit2.dataSources[0])).toEqual(50);
        }));
      });

      describe('standardizeDataSource', function() {
        it('should sort the cutoffs and values of an piecewise-linear pvf', inject(function(PartialValueFunctionService) {
          var dataSource = {
            pvf: {
              'type': 'piecewise-linear',
              'direction': 'increasing',
              'cutoffs': [75, 7.5, 50],
              'values': [0.25, 0.5, 0.75]
            }
          };
          var result = PartialValueFunctionService.standardizeDataSource(dataSource);
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
          var dataSource = {
            pvf: {
              'type': 'piecewise-linear',
              'direction': 'decreasing',
              'cutoffs': [75, 7.5, 50],
              'values': [0.25, 0.5, 0.75]
            }
          };
          var result = PartialValueFunctionService.standardizeDataSource(dataSource);
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
          var dataSource = {
            pvf: {
              'type': 'linear',
              'cutoffs': [75, 7.5, 50],
              'values': [0.25, 0.5, 0.75]
            }
          };
          var result = PartialValueFunctionService.standardizeDataSource(dataSource);
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
