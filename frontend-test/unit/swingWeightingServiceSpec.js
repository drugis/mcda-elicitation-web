'use strict';
/* global exampleProblem */
define([
  'lodash',
  'angular',
  'angular-mocks',
  'mcda/preferences/preferences'
], function (_, angular) {
  describe('Exact swing weighting service', function () {
    var scope;
    var currentScenario;
    var $stateParams;
    var stateMock = jasmine.createSpyObj('$state', ['go']);
    var orderingServiceMock = jasmine.createSpyObj('OrderingService', [
      'getOrderedCriteriaAndAlternatives'
    ]);
    var taskDefinition = jasmine.createSpyObj('taskDefinition', ['clean']);
    taskDefinition.clean.and.callFake(_.identity);
    var orderings = {
      criteria: [],
      alternatives: []
    };
    orderingServiceMock.getOrderedCriteriaAndAlternatives.and.returnValue({
      then: function (f) {
        f(orderings);
      }
    });
    var sliderOptions;
    var getValues = function (criteria) {
      return _.mapValues(criteria, function () {
        return 100;
      });
    };
    var baseTitle = 'Precise swing';
    var toBackEnd = function (mostImportantCriterionId) {
      return function (value, key) {
        return {
          type: 'exact swing',
          ratio: 1 / (value / 100),
          criteria: [mostImportantCriterionId, key]
        };
      };
    };
    var workspaceSettingsServiceMock = jasmine.createSpyObj(
      'WorkspaceSettingsService',
      ['usePercentage', 'getRandomSeed']
    );
    var preferencesServiceMock = jasmine.createSpyObj('PreferencesService', [
      'getWeights'
    ]);
    preferencesServiceMock.getWeights.and.returnValue({
      then: (callback) => {
        callback();
      }
    });

    beforeEach(
      angular.mock.module('elicit.preferences', function ($provide) {
        $provide.value('$state', stateMock);
        $provide.value(
          'WorkspaceSettingsService',
          workspaceSettingsServiceMock
        );
        $provide.value('OrderingService', orderingServiceMock);
        $provide.value('PreferencesService', preferencesServiceMock);
      })
    );

    beforeEach(inject(function ($rootScope, SwingWeightingService) {
      orderings = {
        criteria: [],
        alternatives: []
      };
      sliderOptions = {};
      scope = $rootScope.$new();
      scope.aggregateState = {
        dePercentified: {
          problem: exampleProblem()
        }
      };
      scope.scalesPromise = {
        then: function (fn) {
          fn();
        }
      };
      currentScenario = jasmine.createSpyObj('currentScenario', ['$save']);
      currentScenario.state = {
        problem: exampleProblem()
      };
      currentScenario.$save.and.callFake(function (_ignore, callback) {
        callback();
      });
      SwingWeightingService.initWeightingScope(
        scope,
        $stateParams,
        currentScenario,
        taskDefinition,
        sliderOptions,
        getValues,
        baseTitle,
        toBackEnd
      );
    }));

    describe('initially', function () {
      it('scope should be initialised', function () {
        expect(scope.canSave).toBeDefined();
        expect(scope.canSave()).toBeFalsy();
        expect(scope.save).toBeDefined();
        expect(scope.cancel).toBeDefined();
        expect(scope.pvf).toBeDefined();

        //wizard shit
        expect(scope.nextStep).toBeDefined();
        expect(scope.canProceed).toBeDefined();
        expect(scope.canProceed(scope.state)).toBeFalsy();
        expect(taskDefinition.clean).toHaveBeenCalled();
      });
    });
    describe('after proceeding', function () {
      beforeEach(function () {
        scope.state.mostImportantCriterionId = 'Prox DVT';
        scope.nextStep(scope.state);
        scope.$digest();
      });
      it('should initialise the sliders', function () {
        var scopeState = scope.state;
        expect(scopeState.step).toBe(2);
        expect(scopeState.values).toEqual({
          'Prox DVT': 100,
          'Dist DVT': 100,
          Bleed: 100,
          Bleed2: 100,
          Bleed3: 100,
          null2Infinity: 100
        });
        expect(scopeState.sliderOptions).toEqual(sliderOptions);
        expect(scopeState.sliderOptionsDisabled.disabled).toBe(true);
        expect(scope.canSave(scopeState)).toBeTruthy();
      });
      describe('save', function () {
        beforeEach(function () {
          spyOn(scope, '$emit');
          scope.save(scope.state);
          scope.$digest();
        });
        afterEach(function () {
          stateMock.go.calls.reset();
        });
        it('should set the preferences properly and go back to the preferences screen', function () {
          expect(currentScenario.$save).toHaveBeenCalled();
          expect(stateMock.go).toHaveBeenCalledWith('preferences');
          expect(scope.$emit).toHaveBeenCalled();
        });
      });
    });
  });
});
