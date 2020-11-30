import ICriterion from '@shared/interface/ICriterion';
import IRanking from '@shared/interface/Scenario/IRanking';
import _ from 'lodash';
import IRankingAnswer from '../Interface/IRankingAnswer';
import {
  addRanking,
  assignMissingRankings,
  buildRankingPreferences,
  findCriterionIdForRank
} from './RankingUtil';

const criteria: ICriterion[] = [
  {
    id: 'critId1'
  } as ICriterion,
  {
    id: 'critId2'
  } as ICriterion,
  {
    id: 'critId3'
  } as ICriterion
];

describe('findCriterionIdForRank', () => {
  it('should return the id of the criterion with the requested rank', () => {
    const rankings = {
      critId2: {
        criterionId: 'critId2',
        rank: 1
      }
    };
    const result: string = findCriterionIdForRank(criteria, rankings, 1);
    expect(result).toEqual('critId2');
  });
});

describe('assignMissingRankings', () => {
  it('should assign the remaining ranks and return the finalized rankings', () => {
    const rankings: Record<string, IRankingAnswer> = {
      critId1: {
        criterionId: 'critId1',
        rank: 1
      }
    };
    const selectedCriterionId = 'critId2';
    const rank = 2;
    const result: Record<string, IRankingAnswer> = assignMissingRankings(
      rankings,
      selectedCriterionId,
      rank,
      criteria
    );
    const expectedResult: Record<string, IRankingAnswer> = {
      critId1: {
        criterionId: 'critId1',
        rank: 1
      },
      critId2: {
        criterionId: 'critId2',
        rank: 2
      },
      critId3: {
        criterionId: 'critId3',
        rank: 3
      }
    };
    expect(result).toEqual(expectedResult);
  });
});

describe('buildOrdinalPreferences', () => {
  const answers: IRankingAnswer[] = [
    {criterionId: 'critId1', rank: 1},
    {criterionId: 'critId2', rank: 2}
  ];
  const result: IRanking[] = buildRankingPreferences(answers);
  const expectedResult: IRanking[] = [
    {
      elicitationMethod: 'ranking',
      type: 'ordinal',
      criteria: ['critId1', 'critId2']
    }
  ];
  expect(result).toEqual(expectedResult);
});

describe('addRanking', () => {
  const rankings: Record<string, IRankingAnswer> = {
    critId1: {
      criterionId: 'critId1',
      rank: 1
    },
    critId2: {
      criterionId: 'critId2',
      rank: 2
    }
  };
  it('should return rankings with a new ranking', () => {
    const result = addRanking(rankings, 'critId3', 3);
    const expectedResult = _.merge({}, rankings, {
      critId3: {criterionId: 'critId3', rank: 3}
    });
    expect(result).toEqual(expectedResult);
  });
  it('should return rankings with an updated rank of an existing criterion', () => {
    const result = addRanking(rankings, 'critId1', 2);
    const expectedResult = _.merge({}, rankings, {
      critId1: {criterionId: 'critId1', rank: 2}
    });
    expect(result).toEqual(expectedResult);
  });
});
