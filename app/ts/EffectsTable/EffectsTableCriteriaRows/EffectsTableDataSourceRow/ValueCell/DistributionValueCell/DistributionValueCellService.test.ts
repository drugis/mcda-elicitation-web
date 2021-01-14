import {renderDistribution} from './DistributionValueCellService';
import {Distribution} from '@shared/interface/IDistribution';
import IEmptyEffect from '@shared/interface/IEmptyEffect';
import IBetaDistribution from '@shared/interface/IBetaDistribution';
import IGammaDistribution from '@shared/interface/IGammaDistribution';
import INormalDistribution from '@shared/interface/INormalDistribution';
import IRangeEffect from '@shared/interface/IRangeEffect';
import ITextEffect from '@shared/interface/ITextEffect';
import IValueEffect from '@shared/interface/IValueEffect';
import IStudentsTDistribution from '@shared/interface/IStudentsTDistribution';

describe('DistributionValueCellService', () => {
  describe('renderDistribution', () => {
    const baseDistribution = {
      alternativeId: 'alternative1',
      dataSourceId: 'dataSource1',
      criterionId: 'criterion1'
    };
    const usePercentage = false;
    it('should return an empty string if there is no distribution', () => {
      const distribution: Distribution = undefined;
      const result = renderDistribution(distribution, usePercentage);
      expect(result).toBe('');
    });

    it('should return an empty string for an empty type distribution', () => {
      const distribution: IEmptyEffect = {...baseDistribution, type: 'empty'};
      const result = renderDistribution(distribution, usePercentage);
      expect(result).toBe('');
    });

    it('should return the string for a beta distribution', () => {
      const distribution: IBetaDistribution = {
        ...baseDistribution,
        type: 'beta',
        alpha: 1,
        beta: 2
      };
      const result = renderDistribution(distribution, usePercentage);
      expect(result).toBe('Beta(1, 2)');
    });

    it('should return the string for a gamma distribution', () => {
      const distribution: IGammaDistribution = {
        ...baseDistribution,
        type: 'gamma',
        alpha: 1,
        beta: 2
      };
      const result = renderDistribution(distribution, usePercentage);
      expect(result).toBe('Gamma(1, 2)');
    });

    it('should return the string for a normal distribution', () => {
      const distribution: INormalDistribution = {
        ...baseDistribution,
        type: 'normal',
        standardError: 1,
        mean: 2
      };
      const result = renderDistribution(distribution, usePercentage);
      expect(result).toBe('Normal(2, 1)');
    });

    it('should return the string for a range distribution', () => {
      const distribution: IRangeEffect = {
        ...baseDistribution,
        type: 'range',
        lowerBound: 1,
        upperBound: 2
      };
      const result = renderDistribution(distribution, usePercentage);
      expect(result).toBe('[1, 2]');
    });

    it('should return the string for a text distribution', () => {
      const distribution: ITextEffect = {
        ...baseDistribution,
        type: 'text',
        text: 'some text'
      };
      const result = renderDistribution(distribution, usePercentage);
      expect(result).toBe('some text');
    });

    it('should return the string for a value distribution', () => {
      const distribution: IValueEffect = {
        ...baseDistribution,
        type: 'value',
        value: 37
      };
      const result = renderDistribution(distribution, usePercentage);
      expect(result).toBe('37');
    });

    it('should reutrn the string for a students t distribution', () => {
      const distribution: IStudentsTDistribution = {
        ...baseDistribution,
        type: 'dt',
        mean: 10,
        standardError: 1,
        dof: 123
      };
      const result = renderDistribution(distribution, usePercentage);
      expect(result).toBe(`Student's t(10, 1, 123)`);
    });
  });
});
