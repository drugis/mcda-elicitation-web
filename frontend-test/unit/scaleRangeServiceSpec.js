'use strict';
define(['lodash', 'angular', 'angular-mocks', 'mcda/subProblem/scaleRangeService'], function(_, angular) {

  // - the lower bound must be lower than the lower end of the observed range
  // - the upper bound should be higher than the upper end of the observed range
  // - the values should be "nice" (have no more than two significant digits, preferably only one)

  // - the lower bound must be greater than or equal to the theoretical lower bound
  // - the upper bound must be smaller than or equal to the theoretical upper bound

  describe('The scaleRange service', function() {

    var workspaceSettingsMock = jasmine.createSpyObj('WorkspaceSettingsService', ['usePercentage']);

    beforeEach(angular.mock.module('elicit.util'));
    beforeEach(angular.mock.module('elicit.subProblem', function($provide) {
      $provide.value('WorkspaceSettingsService', workspaceSettingsMock);
    }));

    describe('calculateScales', function() {
      it('on unbounded scales, bounds should lie outside the observed range', inject(function(ScaleRangeService) {
        var dataSourceScale = [null, null];
        var from = -16.123;
        var to = -12.123;
        var criterionRange = [from, to];

        var result = ScaleRangeService.calculateScales(dataSourceScale, from, to, criterionRange);
        expect(result.sliderOptions.floor).toEqual(-20);
        expect(result.sliderOptions.ceil).toEqual(-10);
        expect(result.sliderOptions.restrictedRange.from).toEqual(-16.123);
        expect(result.sliderOptions.restrictedRange.to).toEqual(-12.123);
      }));

      it('should work for fractional/small ranges', inject(function(ScaleRangeService) {
        var dataSourceScale = [0, 1];
        var from = 0.17791;
        var to = 0.25323;
        var criterionRange = [from, to];

        var result = ScaleRangeService.calculateScales(dataSourceScale, from, to, criterionRange);
        expect(result.sliderOptions.floor).toEqual(0.1);
        expect(result.sliderOptions.ceil).toEqual(0.30000000000000004);
      }));
    });

    describe('niceFrom', function() {
      it('should', inject(function(ScaleRangeService) {
        expect(ScaleRangeService.niceFrom(150)).toEqual(100);
        expect(ScaleRangeService.niceFrom(15)).toEqual(10);
        expect(ScaleRangeService.niceFrom(1.5)).toEqual(1);
        expect(ScaleRangeService.niceFrom(0.15)).toEqual(0.1);
        expect(ScaleRangeService.niceFrom(0.015)).toEqual(0.01);

        expect(ScaleRangeService.niceFrom(-150)).toEqual(-200);
        expect(ScaleRangeService.niceFrom(-15)).toEqual(-20);
        expect(ScaleRangeService.niceFrom(-1.5)).toEqual(-2);
        expect(ScaleRangeService.niceFrom(-0.15)).toEqual(-0.2);
        expect(ScaleRangeService.niceFrom(-0.015)).toEqual(-0.02);

        expect(ScaleRangeService.niceFrom(0)).toEqual(0);

      }));
    });
    describe('niceTo', function() {
      it('should', inject(function(ScaleRangeService) {
        expect(ScaleRangeService.niceTo(150)).toEqual(200);
        expect(ScaleRangeService.niceTo(15)).toEqual(20);
        expect(ScaleRangeService.niceTo(1.5)).toEqual(2);
        expect(ScaleRangeService.niceTo(0.15)).toEqual(0.2);
        expect(ScaleRangeService.niceTo(0.015)).toEqual(0.02);

        expect(ScaleRangeService.niceTo(-150)).toEqual(-100);
        expect(ScaleRangeService.niceTo(-15)).toEqual(-10);
        expect(ScaleRangeService.niceTo(-1.5)).toEqual(-1);
        expect(ScaleRangeService.niceTo(-0.15)).toEqual(-0.1);
        expect(ScaleRangeService.niceTo(-0.015)).toEqual(-0.01);

        expect(ScaleRangeService.niceTo(0)).toEqual(0);
      }));
    });
    describe('createRanges', function() {
      it('should create ranges for each scales choices', inject(function(ScaleRangeService) {
        var choices = {
          headacheId: {
            from: 10,
            to: 20
          },
          nauseaId: {
            from: 30,
            to: 40
          }
        };

        var ranges = ScaleRangeService.createRanges(choices);

        var expectedRanges = {
          headacheId: {
            pvf: {
              range: [10, 20]
            }
          },
          nauseaId: {
            pvf: {
              range: [30, 40]
            }
          }
        };
        expect(ranges).toEqual(expectedRanges);
      }));
    });
    describe('getScalesStateAndChoices', function() {
      it('should return the scale state and the choices', inject(function(ScaleRangeService) {
        var observedScales = {
          ds1: {
            alt1: {
              '2.5%': 10,
              '50%': 20,
              '97.5%': 30
            }
          },
          ds2: {
            alt1: {
              '2.5%': 15,
              '50%': 25,
              '97.5%': 35
            }
          }
        };
        var criteria = [{
          id: 'headacheId',
          dataSources: [{
            pvf: {
              range: [0, 40]
            },
            id: 'ds1'
          }]
        }, {
          id: 'nauseaId',
          dataSources: [{
            pvf: {
              range: [10, 40]
            },
            id: 'ds2'
          }]
        }];
        var result = ScaleRangeService.getScalesStateAndChoices(observedScales, criteria);
        var expectedResult = {
          choices: {
            ds1: {
              from: 0,
              to: 40
            },
            ds2: {
              from: 10,
              to: 40
            }
          },
          scalesState: {
            ds1: {
              sliderOptions: {
                restrictedRange: {
                  from: 10,
                  to: 30
                },
                floor: 0,
                ceil: 40,
                step: 0.4,
                precision: 4,
                noSwitching: true
              }
            },
            ds2: {
              sliderOptions: {
                restrictedRange: {
                  from: 15,
                  to: 35
                },
                floor: 10,
                ceil: 40,
                step: 0.3,
                precision: 4,
                noSwitching: true
              }
            }
          }
        };
        expect(typeof result.scalesState.ds1.increaseFrom).toBe('function');
        expect(typeof result.scalesState.ds1.increaseTo).toBe('function');
        expect(typeof result.scalesState.ds2.increaseFrom).toBe('function');
        expect(typeof result.scalesState.ds2.increaseTo).toBe('function');
        var relevantProperties = ['restrictedRange', 'floor', 'ceil', 'step', 'precision', 'noSwitching'];
        var subResultDs1 = _.pick(result.scalesState.ds1.sliderOptions, relevantProperties);
        expect(subResultDs1).toEqual(expectedResult.scalesState.ds1.sliderOptions);
        var subResultDs2 = _.pick(result.scalesState.ds2.sliderOptions, relevantProperties);
        expect(subResultDs2).toEqual(expectedResult.scalesState.ds2.sliderOptions);
        expect(result.choices).toEqual(expectedResult.choices);
      }));
    });
  });
});
