'use strict';
define(['angular', 'angular-mocks', 'mcda/preferences/preferences'], function(angular) {
  describe('the TradeOffService', function() {
    var tradeOffService;
    var taskResultsDefer;
    var pataviResultsServiceMock = jasmine.createSpyObj('PataviResultsService', ['postAndHandleResults']);
    var workspaceSettingsServiceMock = jasmine.createSpyObj('WorkspaceSettingsService', ['usePercentage']);

    beforeEach(angular.mock.module('elicit.preferences', function($provide) {
      $provide.value('PataviResultsService', pataviResultsServiceMock);
      $provide.value('WorkspaceSettingsService', workspaceSettingsServiceMock);
    }));

    beforeEach(inject(function($q, TradeOffService) {
      tradeOffService = TradeOffService;
      taskResultsDefer = $q.defer();
    }));

    describe('getIndifferenceCurve', function() {
      beforeEach(function() {
        var taskResultsPromise = taskResultsDefer.promise;
        pataviResultsServiceMock.postAndHandleResults.and.returnValue(taskResultsPromise);
      });

      it('should attach the selected coordinates and criteria, query R and return a promise for the results', function() {
        var problem = {};
        var criteria = {
          firstCriterion: {
            id: 'crit1'
          },
          secondCriterion: {
            id: 'crit2'
          }
        };
        var coordinates = { x: 1, y: 2 };
        tradeOffService.getIndifferenceCurve(problem, criteria, coordinates);
        expect(pataviResultsServiceMock.postAndHandleResults).toHaveBeenCalledWith({
          criteria: {},
          method: 'indifferenceCurve',
          indifferenceCurve: {
            criterionX: 'crit1',
            criterionY: 'crit2',
            x: 1,
            y: 2
          }
        });
      });
    });

    describe('getInitialSettings', function() {
      it('should return new initialization settings', function() {
        var root = 'root';
        var data = [];
        var sliderOptions = {
          floor: 0,
          ceil: 100
        };
        var settings = {
          firstCriterion: {
            title: 'firstTitle',
            dataSources: [{ scale: [-Infinity, Infinity] }]
          },
          secondCriterion: {
            title: 'secondTitle',
            unitOfMeasurement: 'uom',
            dataSources: [{ scale: [-Infinity, Infinity] }]
          }
        };
        var minY = 0;
        var maxY = 10;
        var result = tradeOffService.getInitialSettings(root, data, sliderOptions, settings, minY, maxY);

        expect(result.bindto).toEqual('root');
        expect(result.data).toEqual([]);
        expect(result.axis.x.min).toEqual(0);
        expect(result.axis.x.max).toEqual(100);
        expect(result.axis.x.label).toEqual('firstTitle');
        expect(result.axis.y.min).toEqual(0);
        expect(result.axis.y.max).toEqual(10);
        expect(result.axis.y.default).toEqual([0, 10]);
        expect(result.axis.y.label).toEqual('secondTitle (uom)');
      });
    });

    describe('getYValue', function() {
      var xValues;
      var yValues;
      beforeEach(function() {
        xValues = ['values_x', 25, 40, 60, 80];
        yValues = ['values', 0, 40, 60, 100];
      });

      it('should given an x and the x and y values of line cutoffs, calculate the y value for the x', function() {
        var x = 50;
        var result = tradeOffService.getYValue(x, xValues, yValues);
        expect(result).toEqual({ x: 50, y: 50 });
      });

      it('should return the nearest cutoff if the x does not fall on the line', function() {
        var xTooSmall = 10;
        var smallResult = tradeOffService.getYValue(xTooSmall, xValues, yValues);
        expect(smallResult).toEqual({ x: 25, y: 0 });
        var xTooLarge = 90;
        var largeResult = tradeOffService.getYValue(xTooLarge, xValues, yValues);
        expect(largeResult).toEqual({ x: 80, y: 100 });
      });

      it('should work for an x that is on a cutoff point', function() {
        var x = 40;
        var result = tradeOffService.getYValue(x, xValues, yValues);
        expect(result).toEqual({ x: 40, y: 40 });
      });
    });

    describe('significantDigits', function() {
      it('should round the input to have 4 significant digits', function() {
        expect(tradeOffService.significantDigits(0)).toBe(0);
        expect(tradeOffService.significantDigits(100)).toBe(100);
        expect(tradeOffService.significantDigits(0.00001)).toBe(0.00001);
        expect(tradeOffService.significantDigits(0.100001)).toBe(0.1);
        expect(tradeOffService.significantDigits(1234.1)).toBe(1234);
        expect(tradeOffService.significantDigits(12345)).toBe(12350);
        expect(tradeOffService.significantDigits(12344)).toBe(12340);
      });
    });

    describe('areCoordinatesSet', function() {
      function xy(x, y) { return { x: x, y: y }; }

      it('should return true if given coordinates are defined', function() {
        var coordinates = xy(1, -2);
        var result = tradeOffService.areCoordinatesSet(coordinates);
        expect(result).toBeTruthy();
      });

      it('should return false if one of the coordinates has an invalid value', function() {
        var coordinatesUndefined = xy(1, undefined);
        var resultUndefined = tradeOffService.areCoordinatesSet(coordinatesUndefined);
        expect(resultUndefined).toBeFalsy();

        var coordinatesMissing = { x: 1 };
        var resultMissing = tradeOffService.areCoordinatesSet(coordinatesMissing);
        expect(resultMissing).toBeFalsy();

        var coordinatesNaN = xy(1, NaN);
        var resultNaN = tradeOffService.areCoordinatesSet(coordinatesNaN);
        expect(resultNaN).toBeFalsy();

        var coordinatesNull = xy(1, null);
        var resultNull = tradeOffService.areCoordinatesSet(coordinatesNull);
        expect(resultNull).toBeFalsy();
      });
    });
    describe('getLabel', function() {
      it('should return the label for the axis of a non-percentifiable criterion', function() {
        var continuousCriterion = {
          title: 'contCrit',
          unitOfMeasurement: 'kg',
          dataSources: [{}]
        };
        var result = tradeOffService.getLabel(continuousCriterion);
        var expectedResult = 'contCrit (kg)';
        expect(result).toEqual(expectedResult);
      });

      it('should return the label for a percentifiable criterion with percentage on', function() {
        workspaceSettingsServiceMock.usePercentage.and.returnValue(true);
        var percentCriterion = {
          title: 'percCrit',
          dataSources: [{ scale: [0, 1] }]
        };
        var result = tradeOffService.getLabel(percentCriterion);
        var expectedResult = 'percCrit (%)';
        expect(result).toEqual(expectedResult);
      });

      it('should return the label for a percentifiable criterion without percentages on', function() {
        workspaceSettingsServiceMock.usePercentage.and.returnValue(false);
        var noPercentCriterion = {
          title: 'percCrit',
          dataSources: [{ scale: [0, 1] }]
        };
        var result = tradeOffService.getLabel(noPercentCriterion);
        var expectedResult = 'percCrit';
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
