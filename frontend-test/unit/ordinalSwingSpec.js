'use strict';
/* global ordinalTestProblem */
define([
  'lodash',
  'angular',
  'angular-mocks',
  'mcda/preferences/preferences'
],
  function(_, angular) {
    var state;

    describe('OrdinalSwingController', function() {
      var $scope1;
      var $scope2;
      var orderingServiceMock = jasmine.createSpyObj('OrderingService', ['getOrderedCriteriaAndAlternatives']);
      var pageTitleServiceMock = jasmine.createSpyObj('PageTitleService', ['setPageTitle']);

      var workspaceSettingsServiceMock = jasmine.createSpyObj('WorkspaceSettingsService', ['usePercentage']);

      beforeEach(angular.mock.module('elicit.preferences', function($provide) {
        $provide.value('WorkspaceSettingsService', workspaceSettingsServiceMock);
      }));
      beforeEach(angular.mock.module('elicit.taskDependencies'));

      function initializeScope($controller, $rootScope, TaskDependencies, problem) {
        var scope;
        scope = $rootScope.$new();
        scope.scenario = jasmine.createSpyObj('scenario', ['$save']);
        var task = {
          requires: [],
          resets: []
        };

        orderingServiceMock.getOrderedCriteriaAndAlternatives.and.returnValue({
          then: function(fn) {
            fn({
              alternatives: [],// alternavtives are not used by the controller
              criteria: _.map(problem.criteria, function(criterion, key) {
                return _.merge({}, criterion, {
                  id: key
                }); // criteria are used by the controller
              })
            });
          }
        });

        state = jasmine.createSpyObj('$state', ['go']);
        scope.aggregateState = {
          problem: problem
        };
        $controller('OrdinalSwingController', {
          $scope: scope,
          $state: state,
          $stateParams: {},
          OrderingService: orderingServiceMock,
          currentScenario: scope.scenario,
          taskDefinition: TaskDependencies.extendTaskDefinition(task),
          PageTitleService: pageTitleServiceMock
        });
        return scope;
      }

      beforeEach(inject(function($controller, $rootScope, TaskDependencies) {
        $scope1 = initializeScope($controller, $rootScope, TaskDependencies, ordinalTestProblem());

        var problem = ordinalTestProblem();
        problem.criteria.Bleed.dataSources[0].pvf.direction = 'increasing';
        $scope2 = initializeScope($controller, $rootScope, TaskDependencies, problem);
      }));

      var proximalDVT = {
        title: 'Proximal DVT',
        dataSources: [{
          id: 'proxDvtDS',
          pvf: {
            range: [0, 0.25],
            type: 'linear',
            direction: 'decreasing'
          },
          scale: [0, 1],
          unitOfMeasurement: {
            label: 'mg/h',
            type: 'custom'
          },
        }],
        id: 'Prox DVT',
        best: 0,
        worst: 0.25
      };

      var distalDVT = {
        title: 'Distal DVT',
        dataSources: [
          {
            id: 'distDvtDS',
            pvf: {
              range: [0.15, 0.4],
              type: 'linear',
              direction: 'decreasing'
            },
            scale: [0, 1],
            unitOfMeasurement: {
              label: 'Proportion',
              type: 'decimal'
            }
          }],
        id: 'Dist DVT',
        best: 0.15,
        worst: 0.4
      };

      var majorBleeding = {
        title: 'Major bleeding',
        dataSources: [{
          id: 'bleedDS',
          pvf: {
            range: [0, 0.1],
            type: 'linear',
            direction: 'decreasing'
          },
          scale: [0, 100],
          unitOfMeasurement: {
            label: '%',
            type: 'percentage'
          }
        }],
        id: 'Bleed',
        best: 0,
        worst: 0.1
      };

      var bleed2 = {
        title: 'Major bleeding',
        dataSources: [{
          id: 'bleedDS',
          pvf: {
            range: [0, 0.1],
            type: 'linear',
            direction: 'decreasing'
          },
          scale: [-Infinity, Infinity],
          unitOfMeasurement: {
            label: '',
            type: 'custom'
          }
        }],
        id: 'Bleed2',
        best: 0,
        worst: 0.1
      };

      var bleed3 = {
        title: 'Major bleeding',
        dataSources: [{
          id: 'bleedDS',
          pvf: {
            range: [0, 0.1],
            type: 'linear',
            direction: 'decreasing'
          },
          scale: [-Infinity, Infinity],
          unitOfMeasurement: {
            label: '',
            type: 'custom'
          }
        }],
        id: 'Bleed3',
        best: 0,
        worst: 0.1
      };

      var null2Infinity = {
        title: 'Major bleeding',
        dataSources: [{
          id: 'null2Infinity',
          pvf: {
            range: [0, 0.1],
            type: 'linear',
            direction: 'decreasing'
          },
          scale: [null, null],
          unitOfMeasurement: {
            label: '',
            type: 'custom'
          }
        }],
        id: 'null2Infinity',
        best: 0,
        worst: 0.1
      };

      describe('initialize', function() {
        it('should be described as ordinal', function() {
          // stuff is set in the wizard
          expect($scope1.state).toBeDefined();
          expect($scope1.state.title).toEqual('Ranking (1/5)');
        });

        it('should not be the final state', function() {
          expect($scope1.canSave($scope1.state)).toBeFalsy();
          expect($scope1.canProceed($scope1.state)).toBeFalsy();
        });

        it('should have the worst alternative as reference on scope 1', function() {
          var expectedResult = [
            proximalDVT,
            distalDVT,
            majorBleeding,
            bleed2,
            bleed3,
            null2Infinity
          ];
          expect($scope1.state.reference).toEqual(expectedResult);
        });

        it('should have the worst alternative as reference on scope 2', function() {
          var expectedResult = [
            proximalDVT,
            distalDVT,
            _.merge({}, majorBleeding, {
              dataSources: [{
                pvf: {
                  direction: 'increasing'
                }
              }],
              best: 0.1,
              worst: 0
            }),
            bleed2,
            bleed3,
            null2Infinity
          ];
          expect($scope2.state.reference).toEqual(expectedResult);
        });

        it('should have a single criterion improved from worst to best in each choice', function() {
          var expectedResult = [
            proximalDVT,
            distalDVT,
            majorBleeding,
            bleed2,
            bleed3,
            null2Infinity
          ];
          expect($scope1.state.choices).toEqual(expectedResult);
        });

        it('should have an empty order', function() {
          expect($scope1.state.prefs.ordinal).toEqual([]);
        });
      });

      describe('nextState', function() {
        it('should not go to next step without valid selection', function() {
          expect($scope1.canProceed($scope1.state)).toEqual(false);
          $scope1.state.choice = 'CHF';
          expect($scope1.canProceed($scope1.state)).toEqual(false);
        });

        it('should have the choice as new reference on scope 1', function() {
          $scope1.state.choice = 'Prox DVT';
          expect($scope1.canProceed($scope1.state)).toEqual(true);
          $scope1.nextStep($scope1.state);
          var expectedResult = [
            proximalDVT,
            distalDVT,
            majorBleeding,
            bleed2,
            bleed3,
            null2Infinity
          ];
          expect($scope1.state.reference).toEqual(expectedResult);
          expect($scope1.state.choice).toBeUndefined();
          expect($scope1.state.title).toEqual('Ranking (2/5)');
        });

        it('should have the choice as new reference on scope 2', function() {
          $scope2.state.choice = 'Dist DVT';
          $scope2.nextStep($scope2.state);
          var expectedResult = [
            proximalDVT,
            distalDVT,
            _.merge({}, majorBleeding, {
              dataSources: [{
                pvf: {
                  direction: 'increasing'
                }
              }],
              best: 0.1,
              worst: 0
            }),
            bleed2,
            bleed3,
            null2Infinity
          ];
          expect($scope2.state.reference).toEqual(expectedResult);
        });

        it('should not contain previous choice', function() {
          $scope1.state.choice = 'Prox DVT';
          $scope1.nextStep($scope1.state);
          expect(_.map($scope1.state.choices, 'id')).toEqual(['Dist DVT', 'Bleed', 'Bleed2', 'Bleed3', 'null2Infinity']);
        });

        it('should improve previous choice on all choices', function() {
          $scope1.state.choice = 'Prox DVT';
          $scope1.nextStep($scope1.state);
          var expectedResult = [
            distalDVT,
            majorBleeding,
            bleed2,
            bleed3,
            null2Infinity
          ];
          expect($scope1.state.choices).toEqual(expectedResult);
        });

        it('should push the choice onto the order', function() {
          $scope1.state.choice = 'Prox DVT';
          $scope1.nextStep($scope1.state);
          expect($scope1.state.prefs.ordinal).toEqual(['Prox DVT']);
        });
      });
    });
  });
