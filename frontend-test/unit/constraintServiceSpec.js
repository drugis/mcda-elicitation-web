'use strict';
define(['angular', 'angular-mocks', 'mcda/manualInput/manualInput'], function (angular) {
  var constraintService;
  beforeEach(module('elicit.manualInput'));
  beforeEach(inject(function (ConstraintService) {
    constraintService = ConstraintService;
  }));
  fdescribe('the ConstraintService', function () {
    describe('defined', function () {
      it('should return a function that behaves as expected', function () {
        var defined = constraintService.defined();
        expect(defined(1)).toBeFalsy();
        expect(defined(0)).toBeFalsy();
        expect(defined(undefined, 'Value')).toBe('Invalid Value');
        expect(defined(NaN, 'balue')).toBe('Invalid balue');
        expect(defined(null, 'Value')).toBe('Invalid Value');
      });
    });
    describe('notNaNOrNull', function () {
      it('should return a function that behaves as expected', function () {
        var notNaNOrNull = constraintService.notNaNOrNull();
        expect(notNaNOrNull(1)).toBeFalsy();
        expect(notNaNOrNull(0)).toBeFalsy();
        expect(notNaNOrNull(NaN, 'balue')).toBe('Invalid balue');
        expect(notNaNOrNull(null, 'Value')).toBe('Invalid Value');
      });
    });
    describe('integer', function () {
      it('should return a function that checks whether something is integer', function () {
        var integer = constraintService.integer();
        expect(integer(1)).toBeFalsy();
        expect(integer(-1030)).toBeFalsy();
        expect(integer(5E3)).toBeFalsy();
        expect(integer(3 / 5, 'volue')).toBe('volue must be integer');
      });
    });
    describe('positive', function () {
      it('should return a function that checks whether the value is positive (including zero)', function () {
        var positive = constraintService.positive();
        expect(positive(5)).toBeFalsy();
        expect(positive(0.5)).toBeFalsy();
        expect(positive(0)).toBeFalsy();
        expect(positive(-0.4, 'velen')).toBe('velen must be positive');
        expect(positive(-10, 'velen')).toBe('velen must be positive');
      });
    });
    describe('belowOrEqualTo', function () {
      it('should return a function that checks whether the value is belowOrEqualTo the given value or property', function () {
        var belowOrEqualToNumber = constraintService.belowOrEqualTo(30);
        var belowOrEqualToProperty = constraintService.belowOrEqualTo('jeMoeder');
        expect(belowOrEqualToNumber(1)).toBeFalsy();
        expect(belowOrEqualToNumber(30)).toBeFalsy();
        expect(belowOrEqualToNumber(31, 'jolue')).toBe('jolue must be below or equal to 30');
        expect(belowOrEqualToProperty(3, 'whatever', { jeMoeder: 31 })).toBeFalsy();
        expect(belowOrEqualToProperty(37, 'jorlue', { jeMoeder: 31 })).toBe('jorlue must be below or equal to 31');
      });
    });
    describe('aboveOrEqualTo', function () {
      it('should return a function that checks whether the value is aboveOrEqualTo the given value or property', function () {
        var aboveOrEqualToNumber = constraintService.aboveOrEqualTo(30);
        var aboveOrEqualToProperty = constraintService.aboveOrEqualTo('jeMoeder');
        expect(aboveOrEqualToNumber(31)).toBeFalsy();
        expect(aboveOrEqualToNumber(30)).toBeFalsy();
        expect(aboveOrEqualToNumber(1, 'jolue')).toBe('jolue must be above or equal to 30');
        expect(aboveOrEqualToProperty(37, 'whatever', { jeMoeder: 31 })).toBeFalsy();
        expect(aboveOrEqualToProperty(7, 'jorlue', { jeMoeder: 31 })).toBe('jorlue must be above or equal to 31');
      });
    });
    describe('above', function () {
      it('should return a function that checks whether the value is above the given value', function () {
        var aboveNumber = constraintService.above(30);
        expect(aboveNumber(31)).toBeFalsy();
        expect(aboveNumber(30,'blalue')).toBe('blalue must be above 30');
        expect(aboveNumber(1, 'jolue')).toBe('jolue must be above 30');
      });
    });
  });
});