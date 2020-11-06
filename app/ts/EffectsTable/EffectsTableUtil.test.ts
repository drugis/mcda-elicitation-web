import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import {canDSBePercentage} from './EffectsTableUtil';

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
});
