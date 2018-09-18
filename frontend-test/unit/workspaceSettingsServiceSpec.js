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
      effectsDisplay: 'effects'
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
      afterEach(function(){
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
            settings: 'settings',
            toggledColumns: 'toggledColumns'
          });
          scope.$apply();
        });
        it('should resolve the loadSettings promise and set the loaded values', function() {
          expect(loadResolved).toBe(true);
          expect(workspaceSettingsService.getToggledColumns()).toEqual('toggledColumns');
          expect(workspaceSettingsService.getWorkspaceSettings()).toEqual('settings');
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

    function expectToGetDefaultValues() {
      expect(workspaceSettingsService.getToggledColumns()).toEqual(DEFAULT_TOGGLED_COLUMNS);
      expect(workspaceSettingsService.getWorkspaceSettings()).toEqual(DEFAULT_SETTINGS);
    }
  });
});
