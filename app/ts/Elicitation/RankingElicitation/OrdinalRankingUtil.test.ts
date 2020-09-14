import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import _ from 'lodash';
import IElicitationCriterion from '../Interface/IElicitationCriterion';
import IOrdinalRanking from '../Interface/IOrdinalRanking';
import IRankingAnswer from '../Interface/IRankingAnswer';
import {
  addRanking,
  assignMissingRankings,
  buildOrdinalPreferences,
  findCriterionIdForRank
} from './OrdinalRankingUtil';

const criteria: Record<string, IElicitationCriterion> = {
  critId1: {
    id: 'critId1',
    title: 'title',
    scales: [0, 1],
    unitOfMeasurement: {type: UnitOfMeasurementType.custom, label: ''},
    pvfDirection: 'increasing',
    description: 'description'
  },
  critId2: {
    id: 'critId2',
    title: 'title',
    scales: [0, 1],
    unitOfMeasurement: {type: UnitOfMeasurementType.custom, label: ''},
    pvfDirection: 'increasing',
    description: 'description'
  },
  critId3: {
    id: 'critId3',
    title: 'title',
    scales: [0, 1],
    unitOfMeasurement: {type: UnitOfMeasurementType.custom, label: ''},
    pvfDirection: 'increasing',
    description: 'description'
  }
};

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
  const result: IOrdinalRanking[] = buildOrdinalPreferences(answers);
  const expectedResult: IOrdinalRanking[] = [
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
