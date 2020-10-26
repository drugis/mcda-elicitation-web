import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IProblemDataSource from '@shared/interface/Problem/IProblemDataSource';
import {
  areTooManyDataSourcesIncluded,
  findRowWithoutValues
} from './ScaleRangesUtil';

describe('ScaleRangesUtil', () => {
  describe('areTooManyDataSourcesIncluded', () => {
    it('return truthy if there is atleast one criterion with multiple selected datasources', () => {
      const criteria: Record<string, IProblemCriterion> = {
        crit1Id: {
          dataSources: [{} as IProblemDataSource, {} as IProblemDataSource]
        } as IProblemCriterion
      };
      const result = areTooManyDataSourcesIncluded(criteria);
      expect(result).toBeTruthy();
    });

    it('should return falsy if there is no criterion with multiple dataSources selected', () => {
      const criteria: Record<string, IProblemCriterion> = {
        crit1Id: {
          dataSources: [{} as IProblemDataSource]
        } as IProblemCriterion
      };
      const result = areTooManyDataSourcesIncluded(criteria);
      expect(result).toBeFalsy();
    });
  });

  describe('findRowWithoutValues', () => {
    it('should return false if there is no row without valid values', () => {
      const criteria: Record<string, IProblemCriterion> = {
        crit1Id: {
          dataSources: [{id: 'ds1Id'} as IProblemDataSource]
        } as IProblemCriterion
      };
      const performanceTable: IPerformanceTableEntry[] = [
        {
          criterion: 'crit1Id',
          dataSource: 'ds1Id',
          alternative: 'alt1Id',
          performance: {effect: {type: 'exact', value: 37}}
        },
        {
          criterion: 'crit1Id',
          dataSource: 'ds1Id',
          alternative: 'alt2Id',
          performance: {distribution: {type: 'exact', value: 37}}
        }
      ];
      const result = findRowWithoutValues(criteria, performanceTable);
      expect(result).toBeFalsy();
    });

    it('should return false if there is a row with empty effect and non-empty effect', () => {
      const criteria: Record<string, IProblemCriterion> = {
        crit1Id: {
          dataSources: [{id: 'ds1Id'} as IProblemDataSource]
        } as IProblemCriterion
      };
      const performanceTable: IPerformanceTableEntry[] = [
        {
          criterion: 'crit1Id',
          dataSource: 'ds1Id',
          alternative: 'alt1Id',
          performance: {effect: {type: 'exact', value: 37}}
        },
        {
          criterion: 'crit1Id',
          dataSource: 'ds1Id',
          alternative: 'alt2Id',
          performance: {effect: {type: 'empty', value: '37'}}
        }
      ];
      const result = findRowWithoutValues(criteria, performanceTable);
      expect(result).toBeFalsy();
    });

    it('should return true if there is at least one row without valid values', function () {
      const criteria: Record<string, IProblemCriterion> = {
        crit1Id: {
          dataSources: [{id: 'ds1Id'} as IProblemDataSource]
        } as IProblemCriterion
      };
      const performanceTable: IPerformanceTableEntry[] = [
        {
          criterion: 'crit1Id',
          dataSource: 'ds1Id',
          alternative: 'alt1Id',
          performance: {effect: {type: 'empty'}}
        },
        {
          criterion: 'crit1Id',
          dataSource: 'ds1Id',
          alternative: 'alt2Id',
          performance: {distribution: {type: 'empty', value: '37'}}
        }
      ];
      const result = findRowWithoutValues(criteria, performanceTable);
      expect(result).toBeTruthy();
    });
  });
});
