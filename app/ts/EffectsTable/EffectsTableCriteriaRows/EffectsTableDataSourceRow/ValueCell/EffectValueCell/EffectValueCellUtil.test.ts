import {Effect} from '@shared/interface/IEffect';
import IEmptyEffect from '@shared/interface/IEmptyEffect';
import IRangeEffect from '@shared/interface/IRangeEffect';
import IScale from '@shared/interface/IScale';
import ITextEffect from '@shared/interface/ITextEffect';
import IValueCIEffect from '@shared/interface/IValueCIEffect';
import IValueEffect from '@shared/interface/IValueEffect';
import {
  renderEnteredValues,
  renderValuesForAnalysis
} from './EffectValueCellUtil';

describe('EffectValueCellService', () => {
  const baseEffect = {
    alternativeId: 'alternative1',
    dataSourceId: 'dataSource1',
    criterionId: 'criterion1'
  };
  const usePercentage = false;
  describe('renderEnteredValues', () => {
    const isInput = false;

    it('should return an empty string when there is no effect', () => {
      const effect: Effect = undefined;
      const result = renderEnteredValues(effect, usePercentage, isInput);
      expect(result).toBe('');
    });

    it('should return an empty string for an empty effect if isInput is false', () => {
      const effect: IEmptyEffect = {...baseEffect, type: 'empty'};
      const result = renderEnteredValues(effect, usePercentage, isInput);
      expect(result).toBe('');
    });

    it('should return the string "empty" for an empty effect if isInput is true', () => {
      const effect: IEmptyEffect = {...baseEffect, type: 'empty'};
      const isInput = true;
      const result = renderEnteredValues(effect, usePercentage, isInput);
      expect(result).toBe('Empty');
    });

    it('should return a range value for a range effect', () => {
      const effect: IRangeEffect = {
        ...baseEffect,
        type: 'range',
        upperBound: 3,
        lowerBound: 1
      };
      const result = renderEnteredValues(effect, usePercentage, isInput);
      expect(result).toBe('[1, 3]');
    });

    it('should return the text of a text effect', () => {
      const effect: ITextEffect = {
        ...baseEffect,
        type: 'text',
        text: 'some text'
      };
      const result = renderEnteredValues(effect, usePercentage, isInput);
      expect(result).toBe('some text');
    });

    it('should return a string for an effect', () => {
      const effect: IValueEffect = {...baseEffect, type: 'value', value: 2};
      const result = renderEnteredValues(effect, usePercentage, isInput);
      expect(result).toBe('2');
    });

    it('should return a string for a confidence interval effect', () => {
      const effect: IValueCIEffect = {
        ...baseEffect,
        type: 'valueCI',
        value: 2,
        lowerBound: 1,
        upperBound: 3,
        isNotEstimableLowerBound: false,
        isNotEstimableUpperBound: false
      };
      const result = renderEnteredValues(effect, usePercentage, isInput);
      expect(result).toBe('2\n(1, 3)');
    });

    it('should return a string for a confidence interval effect with not estimable bounds', () => {
      const effect: IValueCIEffect = {
        ...baseEffect,
        type: 'valueCI',
        value: 2,
        lowerBound: undefined,
        upperBound: undefined,
        isNotEstimableLowerBound: true,
        isNotEstimableUpperBound: true
      };
      const result = renderEnteredValues(effect, usePercentage, isInput);
      expect(result).toBe('2\n(NE, NE)');
    });
  });

  describe('renderValuesForAnalysis', () => {
    const scale: IScale = {'2.5%': 1, '50%': 2, '97.5%': 3, mode: 4};

    it('should get the value string for a range effect', () => {
      const effect: IRangeEffect = {
        ...baseEffect,
        type: 'range',
        upperBound: 3,
        lowerBound: 1
      };
      const result = renderValuesForAnalysis(effect, usePercentage, scale);
      expect(result).toBe('2');
    });

    it('should return a value string for an effect', () => {
      const effect: IValueEffect = {...baseEffect, type: 'value', value: 2};
      const result = renderValuesForAnalysis(effect, usePercentage, scale);
      expect(result).toBe('2');
    });

    it('should return a value string for a confidence interval effect', () => {
      const effect: IValueCIEffect = {
        ...baseEffect,
        type: 'valueCI',
        value: 2,
        lowerBound: 1,
        upperBound: 3,
        isNotEstimableLowerBound: false,
        isNotEstimableUpperBound: false
      };
      const result = renderValuesForAnalysis(effect, usePercentage, scale);
      expect(result).toBe('2');
    });

    it('should return a value string made from the scale if the effect is not preset', () => {
      const effect: Effect = undefined;
      const result = renderValuesForAnalysis(effect, usePercentage, scale);
      expect(result).toBe('2');
    });

    it('should return a value string made from the scale if the effect is empty', () => {
      const effect: IEmptyEffect = {...baseEffect, type: 'empty'};
      const result = renderValuesForAnalysis(effect, usePercentage, scale);
      expect(result).toBe('2');
    });

    it('should return a value string made from the scale if the effect is text', () => {
      const effect: ITextEffect = {
        ...baseEffect,
        type: 'text',
        text: 'bla'
      };
      const result = renderValuesForAnalysis(effect, usePercentage, scale);
      expect(result).toBe('2');
    });

    it('should return a no data message if there is no scale value', () => {
      const effect: IEmptyEffect = {...baseEffect, type: 'empty'};
      const emptyScale: IScale = {
        '2.5%': null,
        '50%': null,
        '97.5%': null,
        mode: null
      };
      const result = renderValuesForAnalysis(effect, usePercentage, emptyScale);
      expect(result).toBe('No data entered');
    });
  });
});
