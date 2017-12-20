'use strict';
define(['angular-mocks', 'mcda/preferences/preferences'], function() {
  describe('Exact swing weighting controller', function() {

    var scope;
    var state;
    var saveDefer;
    var saveSpy = function(_ignore, callback) {
      callback();
    };
    var orderingServiceMock = jasmine.createSpyObj('OrderingService', ['getOrderedCriteriaAndAlternatives']);

    beforeEach(module('elicit.preferences'));
    beforeEach(module('elicit.taskDependencies'));

    beforeEach(inject(function($controller, $q, $rootScope, TaskDependencies) {
      scope = $rootScope.$new();

      saveDefer = $q.defer();

      scope.scenario = jasmine.createSpyObj('scenario', ['$save']);
      scope.scenario.$save.and.callFake(saveSpy);

      var task = {
        requires: [],
        resets: []
      };

      state = jasmine.createSpyObj('$state', ['go']);
      orderingServiceMock.getOrderedCriteriaAndAlternatives.and.returnValue({
        then: function() {
          return;
        }
      });
      scope.aggregateState = {
        problem: exampleProblem()
      };
      $controller('SwingWeightingController', {
        $scope: scope,
        $state: state,
        $stateParams: {},
        OrderingService: orderingServiceMock,
        currentScenario: scope.scenario,
        taskDefinition: TaskDependencies.extendTaskDefinition(task)
      });
    }));
    describe('initially', function() {
      it('scope should be initialised', function() {
        expect(scope.canSave).toBeDefined();
        expect(scope.canSave()).toBeFalsy();
        expect(scope.save).toBeDefined();
        expect(scope.cancel).toBeDefined();
        expect(scope.pvf).toBeDefined();

        //wizard shit
        expect(scope.nextStep).toBeDefined();
        expect(scope.canProceed).toBeDefined();
        expect(scope.canProceed(scope.state)).toBeFalsy();
      });
      describe('cancel', function() {
        beforeEach(function() {
          scope.cancel();
          scope.$digest();
        });
        afterEach(function() {
          state.go.calls.reset();
        });
        it('should navigate to preferences', function() {
          expect(state.go).toHaveBeenCalledWith('preferences');
        });
      });
      it('setting a most important criterion should allow proceeding to next step', function() {
        scope.state.mostImportantCriterion = 'bla';
        scope.$digest();
        expect(scope.canProceed(scope.state)).toBeTruthy();
      });
    });
    describe('after proceeding', function() {
      beforeEach(function() {
        scope.state.mostImportantCriterion = 'Prox DVT';
        scope.nextStep(scope.state);
        scope.$digest();
      });
      it('should initialise the sliders', function() {
        var scopeState = scope.state;
        expect(scopeState.step).toBe(2);
        expect(scopeState.values).toEqual({
          'Prox DVT': 100,
          'Dist DVT': 100,
          'Bleed': 100
        });
        expect(scopeState.sliderOptions.floor).toBe(1);
        expect(scopeState.sliderOptionsDisabled.disabled).toBe(true);
        expect(scope.canSave(scopeState)).toBeTruthy();
      });
      describe('save', function() {
        var resultsAccessible;
        var deregisterWatcher;

        beforeEach(function() {
          deregisterWatcher = scope.$watch('elicit.resultsAccessible', function() {
            resultsAccessible = true;
          });
        });
        afterEach(function() {
          state.go.calls.reset();
          deregisterWatcher();
        });
        it('should set the preferences properly and go back to the preferences screen', function() {
          scope.save(scope.state);
          scope.$digest();
          expect(scope.scenario.state.problem).toEqual(scope.state.problem);
          expect(scope.scenario.state.prefs).toEqual([{
            type: 'exact swing',
            ratio: 1,
            criteria: ['Prox DVT', 'Dist DVT']
          }, {
            type: 'exact swing',
            ratio: 1,
            criteria: ['Prox DVT', 'Bleed']
          }]);
          expect(scope.scenario.$save).toHaveBeenCalled();
          expect(state.go).toHaveBeenCalledWith('preferences');
          expect(resultsAccessible).toBe(true);
        });
      });
    });
  });
});