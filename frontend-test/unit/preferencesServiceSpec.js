'use strict';
define(['angular', 'angular-mocks', 'mcda/preferences/preferences'], function(angular) {
  describe('Preferences service', function() {
    var preferencesService;
    var pataviResultsServiceMock = jasmine.createSpyObj('PataviResultsServiceMock', ['somefunction']);

    beforeEach(angular.mock.module('elicit.preferences', function($provide) {
      $provide.value('PataviResultsService', pataviResultsServiceMock);
    }));
    beforeEach(inject(function(PreferencesService) {
      preferencesService = PreferencesService;
    }));

    describe('buildImportance', function() {
      var criteria = {
        crit1: {
          id: 'crit1'
        },
        crit2: {
          id: 'crit2'
        },
        crit3: {
          id: 'crit3'
        }
      };
      it('should work for missing preferences', function() {
        var result = preferencesService.buildImportance(criteria, {});
        var expectedResult = {
          crit1: '?',
          crit2: '?',
          crit3: '?'
        };
        expect(result).toEqual(expectedResult);
        result = preferencesService.buildImportance(criteria, undefined);
        expect(result).toEqual(expectedResult);
      });
      it('should work for ordinal preferences', function() {
        var prefs = [{
          type: 'ordinal',
          criteria: ['crit2', 'crit1']
        },
        {
          type: 'ordinal',
          criteria: ['crit1', 'crit3']
        }
        ];
        var result = preferencesService.buildImportance(criteria, prefs);
        var expectedResult = {
          crit1: 2,
          crit2: 1,
          crit3: 3
        };
        expect(result).toEqual(expectedResult);
      });
      it('should work for precise preferences', function() {
        var prefs = [{
          type: 'exact swing',
          criteria: ['crit2', 'crit1'],
          ratio: 2
        },
        {
          type: 'exact swing',
          criteria: ['crit2', 'crit3'],
          ratio: 5
        }
        ];
        var result = preferencesService.buildImportance(criteria, prefs);
        var expectedResult = {
          crit1: '50%',
          crit2: '100%',
          crit3: '20%'
        };
        expect(result).toEqual(expectedResult);
      });
      it('should work for imprecise preferences', function() {
        var prefs = [{
          type: 'ratio bound',
          criteria: ['crit2', 'crit1'],
          bounds: [2, 4]
        },
        {
          type: 'ratio bound',
          criteria: ['crit2', 'crit3'],
          bounds: [4, 5]
        }
        ];
        var result = preferencesService.buildImportance(criteria, prefs);
        var expectedResult = {
          crit1: '25-50%',
          crit2: '100%',
          crit3: '20-25%'
        };
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
