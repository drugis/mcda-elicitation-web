'use strict';
define(['angular', 'angular-mocks', 'mcda/manualInput/manualInput'], function (angular) {
  describe('the ConstraintService', function () {
    var constraintService;

    beforeEach(angular.mock.module('elicit.manualInput'));

    beforeEach(inject(function (ConstraintService) {
      constraintService = ConstraintService;
    }));

    describe('defined', function () {
      it('should return an object with a function that behaves as expected', function () {
        var defined = constraintService.defined();
        expect(defined.validator(0)).toBeFalsy();
        expect(defined.validator(1)).toBeFalsy();
        expect(defined.validator(undefined, 'Value')).toBe('Invalid Value');
        expect(defined.validator(NaN, 'balue')).toBe('Invalid balue');
        expect(defined.validator(null, 'Value')).toBe('Invalid Value');
      });
    });

    describe('notNaNOrNull', function () {
      it('should return an object with a function that behaves as expected', function () {
        var notNaNOrNull = constraintService.notNaNOrNull();
        expect(notNaNOrNull.validator(1)).toBeFalsy();
        expect(notNaNOrNull.validator(0)).toBeFalsy();
        expect(notNaNOrNull.validator(NaN, 'balue')).toBe('Invalid balue');
        expect(notNaNOrNull.validator(null, 'Value')).toBe('Invalid Value');
      });
    });

    describe('integer', function () {
      it('should return an object with a function that checks whether something is integer', function () {
        var integer = constraintService.integer();
        expect(integer.validator(1)).toBeFalsy();
        expect(integer.validator(-1030)).toBeFalsy();
        expect(integer.validator(5E3)).toBeFalsy();
        expect(integer.validator(3 / 5, 'volue')).toBe('volue must be integer');
      });
    });

    describe('positive', function () {
      it('should return an object with a function that checks whether the value is positive (including zero)', function () {
        var positive = constraintService.positive();
        expect(positive.validator(5)).toBeFalsy();
        expect(positive.validator(0.5)).toBeFalsy();
        expect(positive.validator(0)).toBeFalsy();
        expect(positive.validator(-0.4, 'velen')).toBe('velen must be positive');
        expect(positive.validator(-10, 'velen')).toBe('velen must be positive');
      });
    });

    describe('belowOrEqualTo', function () {
      it('should return an object with a function that checks whether the value is belowOrEqualTo the given value or property', function () {
        var belowOrEqualToNumber = constraintService.belowOrEqualTo(30);
        var belowOrEqualToProperty = constraintService.belowOrEqualTo('jeMoeder');
        expect(belowOrEqualToNumber.validator(1)).toBeFalsy();
        expect(belowOrEqualToNumber.validator(30)).toBeFalsy();
        expect(belowOrEqualToNumber.validator(31, 'jolue')).toBe('jolue must be below or equal to 30');
        expect(belowOrEqualToProperty.validator(3, 'whatever', { jeMoeder: 31 })).toBeFalsy();
        expect(belowOrEqualToProperty.validator(37, 'jorlue', { jeMoeder: 31 })).toBe('jorlue must be below or equal to 31');
      });
    });

    describe('aboveOrEqualTo', function () {
      it('should return an object with a function that checks whether the value is aboveOrEqualTo the given value or property', function () {
        var aboveOrEqualToNumber = constraintService.aboveOrEqualTo(30);
        var aboveOrEqualToProperty = constraintService.aboveOrEqualTo('jeMoeder');
        expect(aboveOrEqualToNumber.validator(31)).toBeFalsy();
        expect(aboveOrEqualToNumber.validator(30)).toBeFalsy();
        expect(aboveOrEqualToNumber.validator(1, 'jolue')).toBe('jolue must be above or equal to 30');
        expect(aboveOrEqualToProperty.validator(37, 'whatever', { jeMoeder: 31 })).toBeFalsy();
        expect(aboveOrEqualToProperty.validator(7, 'jorlue', { jeMoeder: 31 })).toBe('jorlue must be above or equal to 31');
      });
    });

    describe('above', function () {
      it('should return an object with a function that checks whether the value is above the given value', function () {
        var aboveNumber = constraintService.above(30);
        expect(aboveNumber.validator(31)).toBeFalsy();
        expect(aboveNumber.validator(30, 'blalue')).toBe('blalue must be above 30');
        expect(aboveNumber.validator(1, 'jolue')).toBe('jolue must be above 30');
      });
    });

    describe('percentage', function () {
      it('should return an object with a function that checks whether the value is between 0 and 100', function () {
        var isPercentage = constraintService.percentage();
        expect(isPercentage.validator(10)).toBeFalsy();
        expect(isPercentage.validator(0)).toBeFalsy();
        expect(isPercentage.validator(100)).toBeFalsy();
        expect(isPercentage.validator(-1)).toEqual('Value must be between 0 and 100');
        expect(isPercentage.validator(101)).toEqual('Value must be between 0 and 100');
      });
    });

    describe('decimal', function () {
      it('should return an object with a function that checks whether the value is between 0 and 1', function () {
        var isDecimal = constraintService.decimal();
        expect(isDecimal.validator(.5)).toBeFalsy();
        expect(isDecimal.validator(0)).toBeFalsy();
        expect(isDecimal.validator(1)).toBeFalsy();
        expect(isDecimal.validator(-0.1)).toEqual('Value must be between 0 and 1');
        expect(isDecimal.validator(1.1)).toEqual('Value must be between 0 and 1');
      });
    });
  });
});
