import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import IOrdering from '@shared/interface/IOrdering';
import IScale from '@shared/interface/IScale';
import {
  createCriteriaWithSwappedDataSources,
  createNewOrdering,
  hasScalevalues
} from './WorkspaceContextUtil';

describe('WorkspaceContextUtil', () => {
  describe('hasScalevalues', () => {
    it('should return true is there is atleast one value for the scales', () => {
      const scales: Record<string, Record<string, IScale>> = {
        ds1id: {alt1Id: {'2.5%': 0, '50%': 50, '97.5%': 100, mode: 50}},
        ds2id: {alt1Id: {'2.5%': null, '50%': null, '97.5%': null, mode: null}}
      };
      expect(hasScalevalues(scales)).toBeTruthy();
    });
    it('should return false is there is no value for the scales', () => {
      const scales: Record<string, Record<string, IScale>> = {
        ds1id: {alt1Id: {'2.5%': null, '50%': null, '97.5%': null, mode: null}},
        ds2id: {alt1Id: {'2.5%': null, '50%': null, '97.5%': null, mode: null}}
      };
      expect(hasScalevalues(scales)).toBeFalsy();
    });
  });

  describe('createNewOrdering', () => {
    it('should return an ordering for the given alternatives and critria', () => {
      const alternatives: IAlternative[] = [
        {
          id: 'alt2Id',
          title: 'alternative 2'
        },
        {
          id: 'alt1Id',
          title: 'alternative 1'
        }
      ];
      const criteria: ICriterion[] = [
        {
          id: 'crit2Id',
          dataSources: [{id: 'ds3Id'} as IDataSource],
          description: '',
          isFavourable: undefined,
          title: 'criterion 2'
        },
        {
          id: 'crit1Id',
          dataSources: [
            {id: 'ds2Id'} as IDataSource,
            {id: 'ds1Id'} as IDataSource
          ],
          description: '',
          isFavourable: undefined,
          title: 'criterion 1'
        }
      ];
      const result: IOrdering = createNewOrdering(alternatives, criteria);
      const expectedResult: IOrdering = {
        alternatives: ['alt2Id', 'alt1Id'],
        criteria: ['crit2Id', 'crit1Id'],
        dataSources: ['ds3Id', 'ds2Id', 'ds1Id']
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createCriteriaWithSwappedDataSources', () => {
    const criteria: ICriterion[] = [
      {
        id: 'crit1Id',
        title: 'criterion1',
        description: '',
        isFavourable: undefined,
        dataSources: [
          {id: 'dontMoveThis'} as IDataSource,
          {id: 'ds1Id'} as IDataSource,
          {id: 'ds2Id'} as IDataSource
        ]
      }
    ];
    const criterionId: string = 'crit1Id';
    const dataSource1Id: string = 'ds1Id';
    const dataSource2Id: string = 'ds2Id';
    const result = createCriteriaWithSwappedDataSources(
      criteria,
      criterionId,
      dataSource1Id,
      dataSource2Id
    );
    const expectedResult: ICriterion[] = [
      {
        id: 'crit1Id',
        title: 'criterion1',
        description: '',
        isFavourable: undefined,
        dataSources: [
          {id: 'dontMoveThis'} as IDataSource,
          {id: 'ds2Id'} as IDataSource,
          {id: 'ds1Id'} as IDataSource
        ]
      }
    ];
    expect(result).toEqual(expectedResult);
  });
});
