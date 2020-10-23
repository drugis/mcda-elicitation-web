import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import {initDataSourceInclusions} from './AddSubproblemButton/AddSubproblemUtil';

describe('AddSubproblemUtil', () => {
  describe('initDataSourceInclusions', () => {
    it('should make a nice object with data source ids and happy little true values', () => {
      const criteria: Record<string, ICriterion> = {
        crit1Id: {
          dataSources: [
            {
              id: 'ds1'
            } as IDataSource,
            {
              id: 'ds2'
            } as IDataSource
          ]
        } as ICriterion,
        crit2Id: {
          dataSources: [
            {
              id: 'ds3'
            } as IDataSource
          ]
        } as ICriterion
      };
      const expectedResult = {
        ds1: true,
        ds2: true,
        ds3: true
      };
      const result = initDataSourceInclusions(criteria);
      expect(result).toEqual(expectedResult);
    });
  });
});
