import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IProblemDataSource from '@shared/interface/Problem/IProblemDataSource';
import {areTooManyDataSourcesIncluded} from './ScaleRangesUtil';

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
});
