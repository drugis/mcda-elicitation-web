import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import IWorkspace from '@shared/interface/IWorkspace';
import {
  areTooManyDataSourcesIncluded,
  findRowWithoutValues,
  hasRowWithOnlySameValue
} from './ScaleRangesUtil';

describe('ScaleRangesUtil', () => {
  describe('areTooManyDataSourcesIncluded', () => {
    it('return truthy if there is atleast one criterion with multiple selected datasources', () => {
      const criteria: ICriterion[] = [
        {
          dataSources: [{} as IDataSource, {} as IDataSource]
        } as ICriterion
      ];
      const result = areTooManyDataSourcesIncluded(criteria);
      expect(result).toBeTruthy();
    });

    it('should return falsy if there is no criterion with multiple dataSources selected', () => {
      const criteria: ICriterion[] = [
        {
          dataSources: [{} as IDataSource]
        } as ICriterion
      ];
      const result = areTooManyDataSourcesIncluded(criteria);
      expect(result).toBeFalsy();
    });
  });

  describe('findRowWithoutValues', () => {
    it('should return false if all rows have numeric values', () => {
      const workspace: IWorkspace = {
        criteria: [
          {
            dataSources: [{id: 'ds1Id'} as IDataSource]
          } as ICriterion
        ],
        effects: [
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt1Id',
            type: 'value',
            value: 37
          }
        ],
        distributions: [
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt2Id',
            type: 'value',
            value: 37
          }
        ]
      } as IWorkspace;
      const result = findRowWithoutValues(workspace);
      expect(result).toBeFalsy();
    });

    it('should return false if there is a row with empty effect and non-empty effect', () => {
      const workspace: IWorkspace = {
        criteria: [
          {
            dataSources: [{id: 'ds1Id'} as IDataSource]
          } as ICriterion
        ],
        effects: [
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt1Id',
            type: 'value',
            value: 37
          },
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt2Id',
            type: 'text',
            value: '37'
          }
        ]
      } as IWorkspace;
      const result = findRowWithoutValues(workspace);
      expect(result).toBeFalsy();
    });

    it('should return true if there is at least one row without valid values', function () {
      const workspace: IWorkspace = {
        criteria: [
          {
            dataSources: [{id: 'ds1Id'} as IDataSource]
          } as ICriterion
        ],
        effects: [
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt1Id',
            type: 'empty'
          }
        ],
        distributions: [
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt2Id',
            type: 'empty'
          }
        ],
        relativePerformances: []
      } as IWorkspace;
      const result = findRowWithoutValues(workspace);
      expect(result).toBeTruthy();
    });

    it('should return false if there are relative performances', function () {
      const workspace: IWorkspace = {
        criteria: [
          {
            dataSources: [{id: 'ds1Id'} as IDataSource]
          } as ICriterion
        ],
        effects: [],
        distributions: [],
        relativePerformances: [
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            type: 'relative-cloglog-normal'
          }
        ]
      } as IWorkspace;
      const result = findRowWithoutValues(workspace);
      expect(result).toBeFalsy();
    });
  });

  describe('hasRowWithOnlySameValue', () => {
    it('should return true if there is a row with equal lower and upper bounds', () => {
      const observedRanges: Record<string, [number, number]> = {
        dsId: [0, 0],
        ds2Id: [0, 1]
      };
      const result = hasRowWithOnlySameValue(observedRanges);
      expect(result).toBeTruthy();
    });

    it("should return false if there isn't a row with equal lower and upper bounds", () => {
      const observedRanges: Record<string, [number, number]> = {
        dsId: [0, 1],
        ds2Id: [0, 1]
      };
      const result = hasRowWithOnlySameValue(observedRanges);
      expect(result).toBeFalsy();
    });

    it('should return false if the oberved ranges are empty', () => {
      const observedRanges: Record<string, [number, number]> = {};
      const result = hasRowWithOnlySameValue(observedRanges);
      expect(result).toBeFalsy();
    });
  });
});
