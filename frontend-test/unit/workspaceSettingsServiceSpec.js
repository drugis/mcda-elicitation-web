'use strict';
define(['angular', 'angular-mocks', 'mcda/workspace/workspace'], function (
  angular
) {
  describe('the WorkspaceSettingsService', function () {
    var workspaceSettingsService, q, scope;
    const state = {
      params: {
        id: 'stateParams'
      },
      reload: jasmine.createSpy('reload')
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
      hasNoDistributions: false,
      isRelativeProblem: false,
      changed: false,
      randomSeed: 1234
    };
    var workspaceSettingsResourceMock = jasmine.createSpyObj(
      'WorkspaceSettingsResource',
      ['get', 'put']
    );

    beforeEach(
      angular.mock.module('elicit.workspace', function ($provide) {
        $provide.value('$state', state);
        $provide.value(
          'WorkspaceSettingsResource',
          workspaceSettingsResourceMock
        );
      })
    );

    beforeEach(inject(function ($q, $rootScope, WorkspaceSettingsService) {
      q = $q;
      scope = $rootScope;
      workspaceSettingsService = WorkspaceSettingsService;
    }));

    describe('getDefaults', function () {
      it('should get the defaults', function () {
        var defaults = {
          settings: DEFAULT_SETTINGS,
          toggledColumns: DEFAULT_TOGGLED_COLUMNS
        };
        var result = workspaceSettingsService.getDefaults();
        expect(result).toEqual(defaults);
      });

      it('should get the default for a relative problem', function () {
        const performanceTable = [{performance: {}}];
        workspaceSettingsService.setWorkspaceSettings(performanceTable);
        const result = workspaceSettingsService.getDefaults();
        const expectedResult = angular.copy({
          settings: DEFAULT_SETTINGS,
          toggledColumns: DEFAULT_TOGGLED_COLUMNS
        });
        expectedResult.settings.isRelativeProblem = true;
        expectedResult.settings.hasNoEffects = true;
        expectedResult.settings.hasNoDistributions = true;
        expectedResult.settings.displayMode = 'values';
        expectedResult.settings.analysisType = 'smaa';
        expect(result).toEqual(expectedResult);
      });

      it('should get the default for a problem without effects', function () {
        const performanceTable = [
          {
            alternative: 'alt1',
            performance: {
              distribution: {}
            }
          }
        ];
        workspaceSettingsService.setWorkspaceSettings(performanceTable);
        const result = workspaceSettingsService.getDefaults();
        const expectedResult = angular.copy({
          settings: DEFAULT_SETTINGS,
          toggledColumns: DEFAULT_TOGGLED_COLUMNS
        });
        expectedResult.settings.hasNoEffects = true;
        expectedResult.settings.analysisType = 'smaa';
        expect(result).toEqual(expectedResult);
      });
    });

    describe('loadWorkspaceSettings', function () {
      var loadedPromise;
      var loadResolved = false;
      var resultsDefer;

      beforeEach(function () {
        resultsDefer = q.defer();
        workspaceSettingsResourceMock.get.and.returnValue({
          $promise: resultsDefer.promise
        });
        loadedPromise = workspaceSettingsService.loadWorkspaceSettings(
          state.params
        );
        loadedPromise.then(function () {
          loadResolved = true;
        });
      });

      afterEach(function () {
        loadResolved = false;
      });

      it('should return a promise and not change settings until the new ones are loaded', function () {
        expect(workspaceSettingsResourceMock.get).toHaveBeenCalledWith(
          state.params
        );
        expect(loadResolved).toBe(false);
        expectToGetDefaultValues();
      });

      describe('after load has resolved with values', function () {
        beforeEach(function () {
          resultsDefer.resolve({
            settings: DEFAULT_SETTINGS,
            toggledColumns: 'toggledColumns'
          });
          scope.$apply();
        });

        it('should resolve the loadSettings promise and set the loaded values', function () {
          expect(loadResolved).toBe(true);
          expect(workspaceSettingsService.getToggledColumns()).toEqual(
            'toggledColumns'
          );
          expect(workspaceSettingsService.setWorkspaceSettings()).toEqual(
            DEFAULT_SETTINGS
          );
        });

        describe('then a new load has resolved without values (so new workspace)', function () {
          beforeEach(function () {
            var emptyResultsDefer = q.defer();
            workspaceSettingsResourceMock.get.and.returnValue({
              $promise: emptyResultsDefer.promise
            });
            emptyResultsDefer.resolve({});
            workspaceSettingsService.loadWorkspaceSettings();
            scope.$apply();
          });

          it('should set default values', function () {
            expectToGetDefaultValues();
          });
        });
      });

      describe('without loading new settings', function () {
        it(
          'the service should return the default values',
          expectToGetDefaultValues
        );
      });
    });

    describe('saveSettings', function () {
      var savedPromise;
      var saveResolved = false;
      var saveDefer;
      var newSettings = {
        randomSeed: 1234
      };
      var newToggledColumns = 'newToggledColumns';
      var deregisterChangeListener;
      var settingsChanged = false;

      beforeEach(function () {
        saveDefer = q.defer();
        workspaceSettingsResourceMock.put.and.returnValue({
          $promise: saveDefer.promise
        });

        savedPromise = workspaceSettingsService.saveSettings(
          angular.copy(newSettings),
          newToggledColumns
        );
        savedPromise.then(function () {
          saveResolved = true;
        });
        deregisterChangeListener = scope.$on(
          'elicit.settingsChanged',
          function () {
            settingsChanged = true;
          }
        );
      });

      afterEach(function () {
        deregisterChangeListener();
        saveResolved = false;
        newSettings = {
          randomSeed: 1234
        };
        newToggledColumns = 'newToggledColumns';
        settingsChanged = false;
      });

      it('should call the save function of the settings resource and return a promise', function () {
        expect(workspaceSettingsResourceMock.put).toHaveBeenCalledWith(
          state.params,
          {
            settings: {changed: true, randomSeed: 1234},
            toggledColumns: newToggledColumns
          }
        );
        expect(saveResolved).toBe(false);
        expect(settingsChanged).toBe(false);
        expectToGetDefaultValues();
      });

      describe('after save has resolved', function () {
        beforeEach(function () {
          saveDefer.resolve();
          scope.$apply();
        });

        it('should resolve the saveSettings promise and set the saved values', function () {
          var expectedSettings = {
            randomSeed: 1234,
            changed: true
          };
          expect(saveResolved).toBe(true);
          expect(workspaceSettingsService.getToggledColumns()).toEqual(
            newToggledColumns
          );
          expect(workspaceSettingsService.setWorkspaceSettings()).toEqual(
            expectedSettings
          );
        });

        it('should broadcast that the settings have changed.', function () {
          expect(settingsChanged).toBe(true);
        });
      });
    });

    describe('saveSettings with new random seed', function () {
      it('should reload state if random seed has changed', function () {
        var newSettings = {
          randomSeed: 1337
        };
        var saveResolved = false;
        var saveDefer = q.defer();

        workspaceSettingsResourceMock.put.and.returnValue({
          $promise: saveDefer.promise
        });

        var savedPromise = workspaceSettingsService.saveSettings(
          angular.copy(newSettings),
          {}
        );
        savedPromise.then(function () {
          saveResolved = true;
        });

        saveDefer.resolve();
        scope.$apply();

        expect(saveResolved).toBe(true);
        expect(state.reload).toHaveBeenCalled();
      });
    });

    describe('setWorkspaceSettings', function () {
      it('should return workspace settings and change the display to SMAA if there are no effects in the performance table', function () {
        var performanceTable = [
          {
            alternative: 'alternativeId',
            performance: {
              distribution: {}
            }
          }
        ];

        var result = workspaceSettingsService.setWorkspaceSettings(
          performanceTable
        );

        var expectedResult = angular.copy(DEFAULT_SETTINGS);
        expectedResult.analysisType = 'smaa';
        expectedResult.hasNoEffects = true;
        expect(result).toEqual(expectedResult);
      });

      it('should return workspace settings and keep the display as "deterministic" if there are effects in the performance table', function () {
        var performanceTable = [
          {
            alternative: 'alternativeId',
            performance: {
              effect: {}
            }
          }
        ];

        var result = workspaceSettingsService.setWorkspaceSettings(
          performanceTable
        );

        var expectedResult = angular.copy(DEFAULT_SETTINGS);
        expectedResult.hasNoDistributions = true;
        expect(result).toEqual(expectedResult);
      });

      it('should return workspace settings and keep the display as "deterministic" if there is no performance table', function () {
        var result = workspaceSettingsService.setWorkspaceSettings();
        var expectedResult = DEFAULT_SETTINGS;
        expect(result).toEqual(expectedResult);
      });

      it('should set the isRelativeProblem parameter to TRUE if the problem is purely relative, and set the display to smaa values if the display mode is on entered data', function () {
        var performanceTable = [
          {
            performance: {
              effect: {}
            }
          }
        ];

        var result = workspaceSettingsService.setWorkspaceSettings(
          performanceTable
        );

        var expectedResult = angular.copy(DEFAULT_SETTINGS);
        expectedResult.isRelativeProblem = true;
        expectedResult.displayMode = 'values';
        expectedResult.analysisType = 'smaa';
        expectedResult.hasNoDistributions = true;
        expect(result).toEqual(expectedResult);
      });
    });

    describe('getWarnings', function () {
      it('should return an empty array if there are no warnings', function () {
        const settings = {
          isRelativeProblem: false,
          hasNoDistributions: false,
          hasNoEffects: false,
          displayMode: 'enteredData',
          analysisType: 'deterministic'
        };
        const result = workspaceSettingsService.getWarnings(settings);
        const expectedResult = [];
        expect(result).toEqual(expectedResult);
      });

      it('should return an array with a no entered data warning if the problem is relative', function () {
        const settings = {
          isRelativeProblem: true,
          hasNoDistributions: false,
          hasNoEffects: false,
          displayMode: 'enteredData',
          analysisType: 'deterministic'
        };
        const result = workspaceSettingsService.getWarnings(settings);
        const expectedResult = ['No entered data available.'];
        expect(result).toEqual(expectedResult);
      });

      it('should return an array with a no entered data for deterministic analysis warning if there are no entered effects', function () {
        const settings = {
          isRelativeProblem: false,
          hasNoDistributions: false,
          hasNoEffects: true,
          displayMode: 'enteredData',
          analysisType: 'deterministic'
        };
        const result = workspaceSettingsService.getWarnings(settings);
        const expectedResult = [
          'No entered data available for deterministic analysis.'
        ];
        expect(result).toEqual(expectedResult);
      });

      it('should return an array with a no entered data for smaa analysis if there are no entered distribtions', function () {
        const settings = {
          isRelativeProblem: false,
          hasNoDistributions: true,
          hasNoEffects: false,
          displayMode: 'enteredData',
          analysisType: 'smaa'
        };
        const result = workspaceSettingsService.getWarnings(settings);
        const expectedResult = ['No entered data available for SMAA analysis.'];
        expect(result).toEqual(expectedResult);
      });
    });

    describe('getRandomSeed', function () {
      it('should resturn the random seed', function () {
        const result = workspaceSettingsService.getRandomSeed();
        const expectedResult = 1234;
        expect(result).toEqual(expectedResult);
      });
    });

    function expectToGetDefaultValues() {
      expect(workspaceSettingsService.getToggledColumns()).toEqual(
        DEFAULT_TOGGLED_COLUMNS
      );
      expect(workspaceSettingsService.setWorkspaceSettings()).toEqual(
        DEFAULT_SETTINGS
      );
    }
  });
});
