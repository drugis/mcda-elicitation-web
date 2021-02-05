import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import {Effect} from '@shared/interface/IEffect';
import IScale from '@shared/interface/IScale';
import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import {canDSBePercentage, findScale, findValue} from './EffectsTableUtil';

describe('EffectsTableUtil', () => {
  describe('canDSBePercentage', () => {
    const criteria: ICriterion[] = [
      {
        dataSources: [
          {
            id: 'ds1Id',
            unitOfMeasurement: {type: 'decimal'} as IUnitOfMeasurement
          } as IDataSource,
          {
            id: 'ds2Id',
            unitOfMeasurement: {type: 'percentage'} as IUnitOfMeasurement
          } as IDataSource,
          {
            id: 'ds3Id',
            unitOfMeasurement: {type: 'custom'} as IUnitOfMeasurement
          } as IDataSource
        ]
      } as ICriterion
    ];

    it('should return true if data source unit is decimal', () => {
      const dataSourceId = 'ds1Id';
      const result = canDSBePercentage(criteria, dataSourceId);
      expect(result).toBeTruthy();
    });

    it('should return true if data source unit is percentage', () => {
      const dataSourceId = 'ds2Id';
      const result = canDSBePercentage(criteria, dataSourceId);
      expect(result).toBeTruthy();
    });

    it('should return false if data source unit is custom', () => {
      const dataSourceId = 'ds3Id';
      const result = canDSBePercentage(criteria, dataSourceId);
      expect(result).toBeFalsy();
    });
  });

  describe('findValue', () => {
    it('should return the first item with matching coordinates', () => {
      const items: Effect[] = [
        {alternativeId: 'alt1Id', dataSourceId: 'ds1Id'} as Effect,
        {alternativeId: 'alt2Id', dataSourceId: 'ds2Id'} as Effect
      ];
      const result = findValue(items, 'ds2Id', 'alt2Id');
      const expectedResult = {alternativeId: 'alt2Id', dataSourceId: 'ds2Id'};
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findScale', () => {
    it('should return the scales for given coordinates', () => {
      const scales: Record<string, Record<string, IScale>> = {
        ds1Id: {
          alt1Id: {
            '2.5%': 0.025,
            '50%': 0.5,
            '97.5%': 0.975,
            mode: 0.5
          }
        }
      };
      const result = findScale(scales, 'ds1Id', 'alt1Id');
      const expectedResult: IScale = {
        '2.5%': 0.025,
        '50%': 0.5,
        '97.5%': 0.975,
        mode: 0.5
      };
      expect(result).toEqual(expectedResult);
    });

    it('should return undefined if the data source is not found', () => {
      const scales: Record<string, Record<string, IScale>> = {
        ds2Id: {
          alt1Id: {} as IScale
        }
      };
      const result = findScale(scales, 'ds1Id', 'alt1Id');
      expect(result).toEqual(undefined);
    });

    it('should return undefined if the alternative is not found', () => {
      const scales: Record<string, Record<string, IScale>> = {
        ds1Id: {
          alt2Id: {} as IScale
        }
      };
      const result = findScale(scales, 'ds1Id', 'alt1Id');
      expect(result).toEqual(undefined);
    });

    it('should return undefined if the scales are empty', () => {
      const scales: Record<string, Record<string, IScale>> = {};
      const result = findScale(scales, 'ds1Id', 'alt1Id');
      expect(result).toEqual(undefined);
    });
  });
});
