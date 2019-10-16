'use strict';
define(['angular', 'angular-mocks', 'mcda/workspace/workspace'], function(angular) {
  describe('the WorkspaceSettingsService', function() {
    var workspaceSettingsService, q, scope;
    var stateParams = {
      id: 'stateParams'
    };
    var DEFAULT_TOGGLED_COLUMNS = {
      criteria: true,
      description: true,
      units: true,
      references: true,
      strength: true
    };
    var DEFAULT_SETTINGS = {
      calculationMethod: 'median',
      showPercentages: true,
      displayMode: 'enteredData',
      analysisType: 'deterministic',
      hasNoEffects: false,
      isRelativeProblem: false
    };
    var workspaceSettingsResourceMock = jasmine.createSpyObj('WorkspaceSettingsResource', ['get', 'put']);

    beforeEach(angular.mock.module('elicit.workspace', function($provide) {
      $provide.value('$stateParams', stateParams);
      $provide.value('WorkspaceSettingsResource', workspaceSettingsResourceMock);
    }));

    beforeEach(inject(function($q, $rootScope, WorkspaceSettingsService) {
      q = $q;
      scope = $rootScope;
      workspaceSettingsService = WorkspaceSettingsService;
    }));

    describe('getDefaults', function() {
      it('should get the defaults', function() {
        var defaults = {
          settings: DEFAULT_SETTINGS,
          toggledColumns: DEFAULT_TOGGLED_COLUMNS
        };
        var result = workspaceSettingsService.getDefaults();
        expect(result).toEqual(defaults);
      });
    });

    describe('loadWorkspaceSettings', function() {
      var loadedPromise;
      var loadResolved = false;
      var resultsDefer;

      beforeEach(function() {
        resultsDefer = q.defer();
        workspaceSettingsResourceMock.get.and.returnValue({
          $promise: resultsDefer.promise
        });
        loadedPromise = workspaceSettingsService.loadWorkspaceSettings(stateParams);
        loadedPromise.then(function() {
          loadResolved = true;
        });
      });

      afterEach(function() {
        loadResolved = false;
      });

      it('should return a promise and not change settings until the new ones are loaded', function() {
        expect(workspaceSettingsResourceMock.get).toHaveBeenCalledWith(stateParams);
        expect(loadResolved).toBe(false);
        expectToGetDefaultValues();
      });

      describe('after load has resolved with values', function() {
        beforeEach(function() {
          resultsDefer.resolve({
            settings: DEFAULT_SETTINGS,
            toggledColumns: 'toggledColumns'
          });
          scope.$apply();
        });

        it('should resolve the loadSettings promise and set the loaded values', function() {
          expect(loadResolved).toBe(true);
          expect(workspaceSettingsService.getToggledColumns()).toEqual('toggledColumns');
          expect(workspaceSettingsService.getWorkspaceSettings()).toEqual(DEFAULT_SETTINGS);
        });

        describe('then a new load has resolved without values (so new workspace)', function() {
          beforeEach(function() {
            var emptyResultsDefer = q.defer();
            workspaceSettingsResourceMock.get.and.returnValue({
              $promise: emptyResultsDefer.promise
            });
            emptyResultsDefer.resolve({});
            workspaceSettingsService.loadWorkspaceSettings();
            scope.$apply();
          });

          it('should set default values', function() {
            expectToGetDefaultValues();
          });
        });
      });

      describe('without loading new settings', function() {
        it('the service should return the default values', expectToGetDefaultValues);
      });

      describe('after loading settings with "effectsDisplay" set to "deterministic"', function() {
        it('should set analysisType to "deterministic" and displayMode to "enteredData"', function() {
          resultsDefer.resolve({
            settings: {
              effectsDisplay: 'deterministic'
            }
          });
          scope.$apply();
          const expectedResult = {
            analysisType: 'deterministic',
            displayMode: 'enteredData'
          };
          expect(workspaceSettingsService.getWorkspaceSettings()).toEqual(expectedResult);
        });
      });

      describe('after loading settings with "effectsDisplay" set to "deterministicMCDA"', function() {
        it('should set analysisType to "deterministic" and displayMode to "values"', function() {
          resultsDefer.resolve({
            settings: {
              effectsDisplay: 'deterministicMCDA'
            }
          });
          scope.$apply();
          const expectedResult = {
            analysisType: 'deterministic',
            displayMode: 'values'
          };
          expect(workspaceSettingsService.getWorkspaceSettings()).toEqual(expectedResult);
        });
      });

      describe('after loading settings with "effectsDisplay" set to "smaaDistributions"', function() {
        it('should set analysisType to "smaa" and displayMode to "enteredData"', function() {
          resultsDefer.resolve({
            settings: {
              effectsDisplay: 'smaaDistributions'
            }
          });
          scope.$apply();
          const expectedResult = {
            analysisType: 'smaa',
            displayMode: 'enteredData'
          };
          expect(workspaceSettingsService.getWorkspaceSettings()).toEqual(expectedResult);
        });
      });

      describe('after loading settings with "effectsDisplay" set to "smaa"', function() {
        it('should set analysisType to "smaa" and displayMode to "values"', function() {
          resultsDefer.resolve({
            settings: {
              effectsDisplay: 'smaa'
            }
          });
          scope.$apply();
          const expectedResult = {
            analysisType: 'smaa',
            displayMode: 'values'
          };
          expect(workspaceSettingsService.getWorkspaceSettings()).toEqual(expectedResult);
        });
      });
    });

    describe('saveSettings', function() {
      var savedPromise;
      var saveResolved = false;
      var saveDefer;
      var newSettings = 'newSettings';
      var newToggledColumns = 'newToggledColumns';
      var deregisterChangeListener;
      var settingsChanged = false;

      beforeEach(function() {
        saveDefer = q.defer();
        workspaceSettingsResourceMock.put.and.returnValue({
          $promise: saveDefer.promise
        });

        savedPromise = workspaceSettingsService.saveSettings(newSettings, newToggledColumns);
        savedPromise.then(function() {
          saveResolved = true;
        });
        deregisterChangeListener = scope.$on('elicit.settingsChanged', function() {
          settingsChanged = true;
        });
      });

      afterEach(function() {
        deregisterChangeListener();
        saveResolved = false;
        newSettings = 'newSettings';
        newToggledColumns = 'newToggledColumns';
        settingsChanged = false;
      });

      it('should call the save function of the settings resource and return a promise', function() {
        expect(workspaceSettingsResourceMock.put).toHaveBeenCalledWith(stateParams, {
          settings: newSettings, toggledColumns: newToggledColumns
        });
        expect(saveResolved).toBe(false);
        expect(settingsChanged).toBe(false);
        expectToGetDefaultValues();
      });

      describe('after save has resolved', function() {
        beforeEach(function() {
          saveDefer.resolve();
          scope.$apply();
        });

        it('should resolve the saveSettings promise and set the saved values', function() {
          expect(saveResolved).toBe(true);
          expect(workspaceSettingsService.getToggledColumns()).toEqual(newToggledColumns);
          expect(workspaceSettingsService.getWorkspaceSettings()).toEqual(newSettings);
        });

        it('should broadcast that the settings have changed.', function() {
          expect(settingsChanged).toBe(true);
        });
      });
    });

    describe('getWorkspaceSettings', function() {
      it('should return workspace settings and change the display to SMAA if there are no effects in the performance table', function() {
        var performanceTable = [{
          alternative: 'alternativeId',
          performance: {
            distribution: {}
          }
        }];

        var result = workspaceSettingsService.getWorkspaceSettings(performanceTable);

        var expectedResult = angular.copy(DEFAULT_SETTINGS);
        expectedResult.analysisType = 'smaa';
        expectedResult.hasNoEffects = true;
        expect(result).toEqual(expectedResult);
      });

      it('should return workspace settings and keep the display as "deterministic" if there are effects in the performance table', function() {
        var performanceTable = [{
          alternative: 'alternativeId',
          performance: {
            effect: {}
          }
        }];

        var result = workspaceSettingsService.getWorkspaceSettings(performanceTable);

        var expectedResult = DEFAULT_SETTINGS;
        expect(result).toEqual(expectedResult);
      });

      it('should return workspace settings and keep the display as "deterministic" if there is no performance table', function() {
        var result = workspaceSettingsService.getWorkspaceSettings();
        var expectedResult = DEFAULT_SETTINGS;
        expect(result).toEqual(expectedResult);
      });

      it('should set the isRelativeProblem parameter to TRUE if the problem is purely relative, and set the display to smaa values if the display mode is on entered data', function() {
        var performanceTable = [{
          performance: {
            effect: {}
          }
        }];

        var result = workspaceSettingsService.getWorkspaceSettings(performanceTable);

        var expectedResult = angular.copy(DEFAULT_SETTINGS);
        expectedResult.isRelativeProblem = true;
        expectedResult.displayMode = 'values';
        expectedResult.analysisType = 'smaa';
        expect(result).toEqual(expectedResult);
      });
    });

    function expectToGetDefaultValues() {
      expect(workspaceSettingsService.getToggledColumns()).toEqual(DEFAULT_TOGGLED_COLUMNS);
      expect(workspaceSettingsService.getWorkspaceSettings()).toEqual(DEFAULT_SETTINGS);
    }
  });
});
