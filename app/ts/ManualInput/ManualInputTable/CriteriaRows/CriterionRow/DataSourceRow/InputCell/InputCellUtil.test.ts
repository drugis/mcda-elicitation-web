import IBetaDistribution from '@shared/interface/IBetaDistribution';
import IDataSource from '@shared/interface/IDataSource';
import IGammaDistribution from '@shared/interface/IGammaDistribution';
import INormalDistribution from '@shared/interface/INormalDistribution';
import IRangeEffect from '@shared/interface/IRangeEffect';
import IValueEffect from '@shared/interface/IValueEffect';
import {createDistributionLabel} from './InputCellUtil';

describe('input cell util', () => {
  describe('createDistributionLabel', () => {
    const dataSource: IDataSource = {
      unitOfMeasurement: {
        lowerBound: 0,
        upperBound: 10
      }
    } as IDataSource;
    const percentageDataSource = {
      ...dataSource,
      unitOfMeasurement: {
        ...dataSource.unitOfMeasurement,
        type: 'percentage'
      }
    } as IDataSource;
    const distributionBase = {
      alternativeId: 'alt',
      criterionId: 'crit',
      dataSourceId: 'ds'
    };
    describe('for effect distributions', () => {
      const valueBase: IValueEffect = {
        ...distributionBase,
        type: 'value',
        value: undefined
      };
      it('should create correct label with undefined value', () => {
        const distribution: IValueEffect = {
          ...valueBase
        };
        expect(createDistributionLabel(distribution, dataSource)).toEqual(
          'No distribution entered'
        );
      });
      it('should create correct label with value out of bounds', () => {
        const distribution: IValueEffect = {
          ...valueBase,
          value: -5
        };
        expect(createDistributionLabel(distribution, dataSource)).toEqual(
          'Invalid value'
        );
      });
      it('should create correct label for valid value', () => {
        const distribution: IValueEffect = {
          ...valueBase,
          value: 0.3
        };
        expect(createDistributionLabel(distribution, dataSource)).toEqual(
          '0.3'
        );
      });
      it('should create correct label for a percentage unit', () => {
        const distribution: IValueEffect = {
          ...valueBase,
          value: 0.3
        };

        expect(
          createDistributionLabel(distribution, percentageDataSource)
        ).toEqual('30%');
      });
    });
    describe('for normal distributions', () => {
      const normalBase: INormalDistribution = {
        ...distributionBase,
        type: 'normal',
        mean: undefined,
        standardError: undefined
      };
      it('should create correct label for an undefined mean or standard error', () => {
        expect(createDistributionLabel(normalBase, dataSource)).toEqual(
          'No distribution entered'
        );
      });
      it('should create correct label with value out of bounds', () => {
        const distribution: INormalDistribution = {
          ...normalBase,
          mean: -5,
          standardError: -10
        };
        expect(createDistributionLabel(distribution, dataSource)).toEqual(
          'Invalid value'
        );
      });
      it('should create correct label for valid values', () => {
        const distribution: INormalDistribution = {
          ...normalBase,
          mean: 0.3,
          standardError: 0.1
        };
        expect(createDistributionLabel(distribution, dataSource)).toEqual(
          'Normal(0.3, 0.1)'
        );
      });
      it('should create correct label for valid values and percentage unit', () => {
        const distribution: INormalDistribution = {
          ...normalBase,
          mean: 0.3,
          standardError: 0.1
        };
        expect(
          createDistributionLabel(distribution, percentageDataSource)
        ).toEqual('Normal(30%, 10%)');
      });
    });
    describe('for range distributions', () => {
      const rangeBase: IRangeEffect = {
        ...distributionBase,
        type: 'range',
        lowerBound: undefined,
        upperBound: undefined
      };
      it('should create correct label for an undefined lower or upper bound', () => {
        expect(createDistributionLabel(rangeBase, dataSource)).toEqual(
          'No distribution entered'
        );
      });
      it('should create correct label with value out of bounds', () => {
        const distribution: IRangeEffect = {
          ...rangeBase,
          lowerBound: -5,
          upperBound: 15
        };
        expect(createDistributionLabel(distribution, dataSource)).toEqual(
          'Invalid value'
        );
      });
      it('should create correct label for valid values', () => {
        const distribution: IRangeEffect = {
          ...rangeBase,
          lowerBound: 0.3,
          upperBound: 0.7
        };
        expect(createDistributionLabel(distribution, dataSource)).toEqual(
          '[0.3, 0.7]'
        );
      });
      it('should create correct label for valid values and percentage data source', () => {
        const distribution: IRangeEffect = {
          ...rangeBase,
          lowerBound: 0.3,
          upperBound: 0.7
        };
        expect(
          createDistributionLabel(distribution, percentageDataSource)
        ).toEqual('[30%, 70%]');
      });
    });
    describe('for beta distributions', () => {
      const betaBase: IBetaDistribution = {
        ...distributionBase,
        type: 'beta',
        alpha: undefined,
        beta: undefined
      };
      it('should create correct label for an undefined alpha or beta', () => {
        expect(createDistributionLabel(betaBase, dataSource)).toEqual(
          'No distribution entered'
        );
      });
      it('should create a correct label for valid values', () => {
        const distribution: IBetaDistribution = {
          ...betaBase,
          alpha: 10,
          beta: 37
        };
        expect(createDistributionLabel(distribution, dataSource)).toEqual(
          'Beta(10, 37)'
        );
      });
    });
    describe('for gamma distributions', () => {
      const gammaBase: IGammaDistribution = {
        ...distributionBase,
        type: 'gamma',
        alpha: undefined,
        beta: undefined
      };
      it('should create correct label for an undefined alpha or beta', () => {
        expect(createDistributionLabel(gammaBase, dataSource)).toEqual(
          'No distribution entered'
        );
      });
      it('should create a correct label for valid values', () => {
        const distribution: IGammaDistribution = {
          ...gammaBase,
          alpha: 10,
          beta: 37
        };
        expect(createDistributionLabel(distribution, dataSource)).toEqual(
          'Gamma(10, 37)'
        );
      });
    });
  });
});
