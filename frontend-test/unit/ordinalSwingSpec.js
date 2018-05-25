'use strict';
define(['lodash', 'angular-mocks',
  'mcda/preferences/preferences'
],
  function(_) {
    var state;

    describe('OrdinalSwingHandler', function() {
      var $scope1;
      var $scope2;
      var orderingServiceMock = jasmine.createSpyObj('OrderingService', ['getOrderedCriteriaAndAlternatives']);

      beforeEach(module('elicit.preferences'));
      beforeEach(module('elicit.taskDependencies'));

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
          taskDefinition: TaskDependencies.extendTaskDefinition(task)
        });
        return scope;
      }

      beforeEach(inject(function($controller, $rootScope, TaskDependencies) {
        $scope1 = initializeScope($controller, $rootScope, TaskDependencies, exampleProblem());

        var problem = exampleProblem();
        problem.criteria.Bleed.dataSources[0].pvf.direction = 'increasing';
        $scope2 = initializeScope($controller, $rootScope, TaskDependencies, problem);
      }));

      describe('initialize', function() {
        it('should be described as ordinal', function() {
          // stuff is set in the wizard
          expect($scope1.state).toBeDefined();
          expect($scope1.state.title).toEqual('Ranking (1/2)');
        });

        it('should not be the final state', function() {
          expect($scope1.canSave($scope1.state)).toBeFalsy();
          expect($scope1.canProceed($scope1.state)).toBeFalsy();
        });

        it('should have the worst alternative as reference', function() {
          expect($scope1.state.reference).toEqual({
            'Prox DVT': 0.25,
            'Dist DVT': 0.4,
            Bleed: 0.1
          });
          expect($scope2.state.reference).toEqual({
            'Prox DVT': 0.25,
            'Dist DVT': 0.4,
            Bleed: 0.0
          });
        });

        it('should have a single criterion improved from worst to best in each choice', function() {
          expect($scope1.state.choices).toEqual({
            'Prox DVT': {
              'Prox DVT': 0.0,
              'Dist DVT': 0.4,
              Bleed: 0.1
            },
            'Dist DVT': {
              'Prox DVT': 0.25,
              'Dist DVT': 0.15,
              Bleed: 0.1
            },
            Bleed: {
              'Prox DVT': 0.25,
              'Dist DVT': 0.4,
              Bleed: 0.0
            }
          });
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

        it('should have the choice as new reference', function() {
          $scope1.state.choice = 'Prox DVT';
          expect($scope1.canProceed($scope1.state)).toEqual(true);
          $scope1.nextStep($scope1.state);
          expect($scope1.state.reference).toEqual({
            'Prox DVT': 0.0,
            'Dist DVT': 0.4,
            Bleed: 0.1
          });
          expect($scope1.state.choice).toBeUndefined();
          expect($scope1.state.title).toEqual('Ranking (2/2)');

          $scope2.state.choice = 'Dist DVT';
          $scope2.nextStep($scope2.state);
          expect($scope2.state.reference).toEqual({
            'Prox DVT': 0.25,
            'Dist DVT': 0.15,
            Bleed: 0.0
          });
        });

        it('should not contain previous choice', function() {
          $scope1.state.choice = 'Prox DVT';
          $scope1.nextStep($scope1.state);
          expect(_.keys($scope1.state.choices)).toEqual(['Dist DVT', 'Bleed']);
        });

        it('should improve previous choice on all choices', function() {
          $scope1.state.choice = 'Prox DVT';
          $scope1.nextStep($scope1.state);
          expect($scope1.state.choices).toEqual({
            'Dist DVT': {
              'Prox DVT': 0.0,
              'Dist DVT': 0.15,
              Bleed: 0.1
            },
            Bleed: {
              'Prox DVT': 0.0,
              'Dist DVT': 0.4,
              Bleed: 0.0
            }
          });
        });

        it('should push the choice onto the order', function() {
          $scope1.state.choice = 'Prox DVT';
          $scope1.nextStep($scope1.state);
          expect($scope1.state.prefs.ordinal).toEqual(['Prox DVT']);
        });
      });

    });
  });
