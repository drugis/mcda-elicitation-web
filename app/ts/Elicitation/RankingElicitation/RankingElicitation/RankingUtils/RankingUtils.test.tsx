import IElicitationCriterion from 'app/ts/Elicitation/Interface/IElicitationCriterion';
import {getCriterionIdForRank, getUpdatedCriteria} from './RankingUtils';

describe('RankingUtil', () => {
  // it('buildCriteria should return a map of criteria', () => {
  //   const effectsTableRows: IRow[] = [
  //     {
  //       mcdaId: 'critId1',
  //       title: 'crit1',
  //       description: 'description',
  //       scales: [0, 1],
  //       unitOfMeasurement: '%',
  //       databaseId: 1,
  //       values: {
  //         altId1: {median: 0.5, upperBound: 1, lowerBound: 0},
  //         altId2: {median: 0.5, upperBound: 1, lowerBound: 0}
  //       },
  //       ordering: 1,
  //       pvfDirection: 'increasing'
  //     }
  //   ];
  //   const result = buildCriteria(effectsTableRows);
  //   const expectedResult: Map<string, IElicitationCriterion> = new Map([
  //     [
  //       'critId1',
  //       {
  //         mcdaId: 'critId1',
  //         title: 'crit1',
  //         scales: [0, 1],
  //         unitOfMeasurement: '%',
  //         databaseId: 1,
  //         description: 'description',
  //         ordering: 1,
  //         pvfDirection: 'increasing'
  //       }
  //     ]
  //   ]);
  //   expect(result).toEqual(expectedResult);
  // });

  it('getCriterionIdForRank should return a criterion with a given rank', () => {
    const criteria: Map<string, IElicitationCriterion> = new Map([
      [
        'critId1',
        {
          mcdaId: 'critId1',
          title: 'crit1',
          scales: [0, 1],
          unitOfMeasurement: '%',
          databaseId: 1,
          ordering: 1
        }
      ],
      [
        'critId2',
        {
          mcdaId: 'critId2',
          title: 'crit2',
          scales: [0, 1],
          unitOfMeasurement: '%',
          databaseId: 1,
          rank: 1,
          ordering: 2
        }
      ],
      [
        'critId3',
        {
          mcdaId: 'critId3',
          title: 'crit3',
          scales: [0, 1],
          unitOfMeasurement: '%',
          databaseId: 1,
          rank: 0,
          ordering: 1
        }
      ]
    ]);
    const rank: number = 1;
    const result = getCriterionIdForRank(criteria, rank);
    const expectedResult = 'critId2';
    expect(result).toEqual(expectedResult);
  });

  it('getUpdatedCriteria should set ranks to two criteria and return the updated collection', () => {
    const criteria: Map<string, IElicitationCriterion> = new Map([
      [
        'critId1',
        {
          mcdaId: 'critId1',
          title: 'crit1',
          scales: [0, 1],
          unitOfMeasurement: '%',
          databaseId: 1,
          ordering: 1
        }
      ],
      [
        'critId2',
        {
          mcdaId: 'critId2',
          title: 'crit2',
          scales: [0, 1],
          unitOfMeasurement: '%',
          databaseId: 2,
          ordering: 2
        }
      ]
    ]);
    const criterionId = 'critId1';
    const rankToSet = 1;
    const result = getUpdatedCriteria(criteria, criterionId, rankToSet);
    const expectedResult: Map<string, IElicitationCriterion> = new Map([
      [
        'critId1',
        {
          mcdaId: 'critId1',
          title: 'crit1',
          scales: [0, 1],
          unitOfMeasurement: '%',
          databaseId: 1,
          rank: 1,
          ordering: 1
        }
      ],
      [
        'critId2',
        {
          mcdaId: 'critId2',
          title: 'crit2',
          scales: [0, 1],
          unitOfMeasurement: '%',
          databaseId: 2,
          rank: 2,
          ordering: 2
        }
      ]
    ]);
    expect(result).toEqual(expectedResult);
  });
});
