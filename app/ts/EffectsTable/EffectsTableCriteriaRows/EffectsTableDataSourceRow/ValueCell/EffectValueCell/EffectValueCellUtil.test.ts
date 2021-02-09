import {Effect} from '@shared/interface/IEffect';
import IEmptyEffect from '@shared/interface/IEmptyEffect';
import IRangeEffect from '@shared/interface/IRangeEffect';
import IScale from '@shared/interface/IScale';
import ITextEffect from '@shared/interface/ITextEffect';
import IValueCIEffect from '@shared/interface/IValueCIEffect';
import IValueEffect from '@shared/interface/IValueEffect';
import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import {renderEffect} from './EffectValueCellUtil';

describe('EffectValueCellService', () => {
  describe('renderEffect', () => {
    const baseEffect = {
      alternativeId: 'alternative1',
      dataSourceId: 'dataSource1',
      criterionId: 'criterion1'
    };
    const usePercentage = false;
    const scale: IScale = {'2.5%': 1, '50%': 2, '97.5%': 3, mode: 4};

    it('should return an empty string when there is no effect', () => {
      const displayMode = 'enteredData';
      const effect: Effect = undefined;
      const result = renderEffect(effect, displayMode, usePercentage, scale);
      expect(result).toBe('');
    });

    it('should return an empty string for an empty effect', () => {
      const displayMode = 'enteredData';
      const effect: IEmptyEffect = {...baseEffect, type: 'empty'};
      const result = renderEffect(effect, displayMode, usePercentage, scale);
      expect(result).toBe('');
    });

    it('should return a range value for a range effect', () => {
      const displayMode = 'enteredData';
      const effect: IRangeEffect = {
        ...baseEffect,
        type: 'range',
        upperBound: 3,
        lowerBound: 1
      };
      const result = renderEffect(effect, displayMode, usePercentage, scale);
      expect(result).toBe('[1, 3]');
    });

    it('should return the text of a text effect', () => {
      const displayMode = 'enteredData';
      const effect: ITextEffect = {
        ...baseEffect,
        type: 'text',
        text: 'some text'
      };
      const result = renderEffect(effect, displayMode, usePercentage, scale);
      expect(result).toBe('some text');
    });

    it('should return a string for an effect', () => {
      const displayMode = 'enteredData';
      const effect: IValueEffect = {...baseEffect, type: 'value', value: 2};
      const result = renderEffect(effect, displayMode, usePercentage, scale);
      expect(result).toBe('2');
    });

    it('should return a string for a confidence interval effect', () => {
      const displayMode = 'enteredData';
      const effect: IValueCIEffect = {
        ...baseEffect,
        type: 'valueCI',
        value: 2,
        lowerBound: 1,
        upperBound: 3,
        isNotEstimableLowerBound: false,
        isNotEstimableUpperBound: false
      };
      const result = renderEffect(effect, displayMode, usePercentage, scale);
      expect(result).toBe('2\n(1, 3)');
    });

    it('should return a string for a confidence interval effect with not estimable bounds', () => {
      const displayMode = 'enteredData';
      const effect: IValueCIEffect = {
        ...baseEffect,
        type: 'valueCI',
        value: 2,
        lowerBound: undefined,
        upperBound: undefined,
        isNotEstimableLowerBound: true,
        isNotEstimableUpperBound: true
      };
      const result = renderEffect(effect, displayMode, usePercentage, scale);
      expect(result).toBe('2\n(NE, NE)');
    });

    it('should get the value string for a range effect', () => {
      const displayMode: TDisplayMode = 'values';
      const effect: IRangeEffect = {
        ...baseEffect,
        type: 'range',
        upperBound: 3,
        lowerBound: 1
      };
      const result = renderEffect(effect, displayMode, usePercentage, scale);
      expect(result).toBe('2');
    });

    it('should return a value string for an effect', () => {
      const displayMode = 'values';
      const effect: IValueEffect = {...baseEffect, type: 'value', value: 2};
      const result = renderEffect(effect, displayMode, usePercentage, scale);
      expect(result).toBe('2');
    });

    it('should return a value string for a confidence interval effect', () => {
      const displayMode = 'values';
      const effect: IValueCIEffect = {
        ...baseEffect,
        type: 'valueCI',
        value: 2,
        lowerBound: 1,
        upperBound: 3,
        isNotEstimableLowerBound: false,
        isNotEstimableUpperBound: false
      };
      const result = renderEffect(effect, displayMode, usePercentage, scale);
      expect(result).toBe('2');
    });

    it('should return a value string made from the scale if the effect is not preset', () => {
      const displayMode = 'values';
      const effect: Effect = undefined;
      const result = renderEffect(effect, displayMode, usePercentage, scale);
      expect(result).toBe('2');
    });

    it('should return a value string made from the scale if the effect is empty', () => {
      const displayMode = 'values';
      const effect: IEmptyEffect = {...baseEffect, type: 'empty'};
      const result = renderEffect(effect, displayMode, usePercentage, scale);
      expect(result).toBe('2');
    });

    it('should return a value string made from the scale if the effect is text', () => {
      const displayMode = 'values';
      const effect: ITextEffect = {
        ...baseEffect,
        type: 'text',
        text: 'bla'
      };
      const result = renderEffect(effect, displayMode, usePercentage, scale);
      expect(result).toBe('2');
    });

    it('should return a no data message if there is no scale value', () => {
      const displayMode = 'values';
      const effect: IEmptyEffect = {...baseEffect, type: 'empty'};
      const emptyScale: IScale = {
        '2.5%': null,
        '50%': null,
        '97.5%': null,
        mode: null
      };
      const result = renderEffect(
        effect,
        displayMode,
        usePercentage,
        emptyScale
      );
      expect(result).toBe('No data entered');
    });
  });
});
