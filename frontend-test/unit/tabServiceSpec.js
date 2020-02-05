'use strict';
define(['angular', 'lodash', 'angular-mocks'], function(angular, _) {
  describe('TabService', function() {
    var tabService;
    var workspaceServiceMock = jasmine.createSpyObj('WorkspaceService', [
      'checkForMissingValuesInPerformanceTable'
    ]);

    beforeEach(function() {
      angular.mock.module('elicit.benefitRisk', function($provide) {
        $provide.value('WorkspaceService', workspaceServiceMock);
      });
    });

    beforeEach(inject(function(TabService) {
      tabService = TabService;
    }));

    describe('getTabStatus', function() {

      var stateName;
      var tasksAccessibility;

      beforeEach(() => {
        workspaceServiceMock.checkForMissingValuesInPerformanceTable.and.returnValue(false);
        stateName = 'evidence';
        tasksAccessibility = {
          results: true,
          preferences: true
        };
      });

      var defaultExpectedResult = {
        overview: {
          enabled: true,
          active: false
        },
        problemDefinition: {
          enabled: true,
          active: false
        },
        preferences: {
          enabled: true,
          active: false,
          tooltip: undefined
        },
        deterministic: {
          enabled: true,
          active: false,
          tooltip: undefined
        },
        smaa: {
          enabled: true,
          active: false,
          tooltip: undefined
        }
      };

      const aggregateState = {
        problem: {
          performanceTable: {}
        }
      };

      it('should set the Overview tab as active and all tabs enabled', function() {
        const result = tabService.getTabStatus(stateName, aggregateState, tasksAccessibility);

        var expectedResult = angular.copy(defaultExpectedResult);
        expectedResult.overview.active = true;
        expect(result).toEqual(expectedResult);
      });

      it('should set the Preferences tab as active if user is setting the partial value functions', function() {
        stateName = 'partial-value-function';
        const result = tabService.getTabStatus(stateName, aggregateState, tasksAccessibility);

        var expectedResult = angular.copy(defaultExpectedResult);
        expectedResult.preferences.active = true;
        expect(result).toEqual(expectedResult);
      });

      it('should set the Preferences tab as active if user is setting the weights', function() {
        stateName = 'imprecise-swing-weighting';
        const result = tabService.getTabStatus(stateName, aggregateState, tasksAccessibility);

        var expectedResult = angular.copy(defaultExpectedResult);
        expectedResult.preferences.active = true;
        expect(result).toEqual(expectedResult);
      });

      it('should disable the preferences, deterministic, and smaa tabs if there are missing values in the effects table', function() {
        workspaceServiceMock.checkForMissingValuesInPerformanceTable.and.returnValue(true);

        const result = tabService.getTabStatus(stateName, aggregateState, tasksAccessibility);

        var expectedResult = angular.copy(defaultExpectedResult);
        expectedResult.overview.active = true;
        expectedResult.preferences.enabled = false;
        expectedResult.preferences.tooltip = 'Cannot elicit preferences because the effects table contains missing values.';
        expectedResult.deterministic.enabled = false;
        expectedResult.deterministic.tooltip = 'Cannot perform analysis because the effects table contains missing values.';
        expectedResult.smaa.enabled = false;
        expectedResult.smaa.tooltip = 'Cannot perform analysis because the effects table contains missing values.';
        expect(result).toEqual(expectedResult);
      });

      it('should disable the preferences, deterministic, and smaa tabs if there are more then 12 criteria in the effects table', function() {
        workspaceServiceMock.checkForMissingValuesInPerformanceTable.and.returnValue(false);
        const aggregateStateWithmoreThan12Criteria = {
          problem: {
            criteria: _(_.range(0, 13))
              .map(function(n) { return [n, {}]; })
              .fromPairs()
              .value()
          }
        };

        const result = tabService.getTabStatus(stateName, aggregateStateWithmoreThan12Criteria, tasksAccessibility);

        var expectedResult = angular.copy(defaultExpectedResult);
        expectedResult.overview.active = true;
        expectedResult.preferences.enabled = false;
        expectedResult.preferences.tooltip = 'Cannot elicit preferences because the effects table contains more than 12 criteria.';
        expectedResult.deterministic.enabled = false;
        expectedResult.deterministic.tooltip = 'Cannot perform analysis because the effects table contains more than 12 criteria.';
        expectedResult.smaa.enabled = false;
        expectedResult.smaa.tooltip = 'Cannot perform analysis because the effects table contains more than 12 criteria.';
        expect(result).toEqual(expectedResult);
      });

      it('should disable the deterministic and smaa tabs if the partial value functions are not set', function() {
        tasksAccessibility.results = false;

        const result = tabService.getTabStatus(stateName, aggregateState, tasksAccessibility);

        var expectedResult = angular.copy(defaultExpectedResult);
        expectedResult.overview.active = true;
        expectedResult.deterministic.enabled = false;
        expectedResult.deterministic.tooltip = 'Cannot perform analysis because not all partial value functions are set.';
        expectedResult.smaa.enabled = false;
        expectedResult.smaa.tooltip = 'Cannot perform analysis because not all partial value functions are set.';
        expect(result).toEqual(expectedResult);
      });

      it('should disable the preferences if the problem has multiple data sources for a criterion', function() {
        tasksAccessibility.results = false;
        tasksAccessibility.preferences = false;

        const result = tabService.getTabStatus(stateName, aggregateState, tasksAccessibility);

        var expectedResult = angular.copy(defaultExpectedResult);
        expectedResult.overview.active = true;
        expectedResult.preferences.enabled = false;
        expectedResult.preferences.tooltip = 'Cannot elicit preferences because the problem has multiple datasources per criterion.';
        expectedResult.deterministic.enabled = false;
        expectedResult.deterministic.tooltip = 'Cannot perform analysis because the problem has multiple datasources per criterion.';
        expectedResult.smaa.enabled = false;
        expectedResult.smaa.tooltip = 'Cannot perform analysis because the problem has multiple datasources per criterion.';
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
