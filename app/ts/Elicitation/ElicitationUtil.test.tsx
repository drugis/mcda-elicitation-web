import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import {
  assignMissingRankings,
  buildElicitationCriteria,
  buildOrdinalPreferences,
  calculateImportance,
  determineStepSize,
  findCriterionIdForRank,
  getBest,
  getWorst
} from './ElicitationUtil';
import IElicitationCriterion from './Interface/IElicitationCriterion';
import IInputCriterion from './Interface/IInputCriterion';
import IOrdinalRanking from './Interface/IOrdinalRanking';
import IRankingAnswer from './Interface/IRankingAnswer';

const criteria: Record<string, IElicitationCriterion> = {
  critId1: {
    mcdaId: 'critId1',
    title: 'title',
    scales: [0, 1],
    unitOfMeasurement: '',
    pvfDirection: 'increasing',
    description: 'description'
  },
  critId2: {
    mcdaId: 'critId2',
    title: 'title',
    scales: [0, 1],
    unitOfMeasurement: '',
    pvfDirection: 'increasing',
    description: 'description'
  },
  critId3: {
    mcdaId: 'critId3',
    title: 'title',
    scales: [0, 1],
    unitOfMeasurement: '',
    pvfDirection: 'increasing',
    description: 'description'
  }
};

describe('getWorst', () => {
  let criterion: IElicitationCriterion = {
    mcdaId: 'critId1',
    title: 'crit1',
    scales: [0, 1],
    unitOfMeasurement: '%',
    description: 'description'
  };

  it('should return the minimal value for a linear increasing PVF', () => {
    criterion.pvfDirection = 'increasing';
    const result = getWorst(criterion);
    const expectedResult = 0;
    expect(result).toEqual(expectedResult);
  });

  it('should return maximal value for a linear decreasing PVF', () => {
    criterion.pvfDirection = 'decreasing';
    const result = getWorst(criterion);
    const expectedResult = 1;
    expect(result).toEqual(expectedResult);
  });

  it('should return -1 if criterion does not have scales', () => {
    delete criterion.scales;
    const result = getWorst(criterion);
    const expectedResult = -1;
    expect(result).toEqual(expectedResult);
  });
});

describe('getBest', () => {
  let criterion: IElicitationCriterion = {
    mcdaId: 'critId1',
    title: 'crit1',
    scales: [0, 1],
    unitOfMeasurement: '%',
    description: 'description'
  };

  it('should return the minimal value for a linear decreasing PVF', () => {
    criterion.pvfDirection = 'decreasing';
    const result = getBest(criterion);
    const expectedResult = 0;
    expect(result).toEqual(expectedResult);
  });

  it('should return maximal value for a linear increasing PVF', () => {
    criterion.pvfDirection = 'increasing';
    const result = getBest(criterion);
    const expectedResult = 1;
    expect(result).toEqual(expectedResult);
  });

  it('should return -1 if criterion does not have scales', () => {
    delete criterion.scales;
    const result = getBest(criterion);
    const expectedResult = -1;
    expect(result).toEqual(expectedResult);
  });
});

describe('buildElicitationCriteria', () => {
  it('should map criteria from MCDA to elicitation criteria and key them by id', () => {
    const input: IInputCriterion[] = [
      {
        id: 'critId',
        title: 'title',
        worst: 0,
        best: 1,
        description: 'description',
        isFavourable: true,
        dataSources: [
          {
            id: 'dsId',
            source: 'source',
            scale: [0, 100],
            unitOfMeasurement: {label: '', type: UnitOfMeasurementType.custom},
            pvf: {direction: 'increasing', type: 'linear', range: [0, 100]}
          }
        ]
      }
    ];
    const result: Record<
      string,
      IElicitationCriterion
    > = buildElicitationCriteria(input);
    const expectedResult = {
      critId: {
        mcdaId: input[0].id,
        title: input[0].title,
        scales: [input[0].worst, input[0].best],
        unitOfMeasurement: input[0].dataSources[0].unitOfMeasurement.label,
        pvfDirection: input[0].dataSources[0].pvf.direction,
        description: input[0].description
      }
    };
    expect(result).toEqual(expectedResult);
  });
});

describe('findCriterionIdForRank', () => {
  it('should return the id of the criterion withthe requested rank', () => {
    const rankings = {
      critId1: {
        criterionId: 'critId1',
        rank: 1
      }
    };
    const result: string = findCriterionIdForRank(criteria, rankings, 1);
    expect(result).toEqual('critId1');
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

describe('determineStepSize', () => {
  it('should return the step size based on the criterion scales', () => {
    const result = determineStepSize(criteria, 'critId1');
    expect(result).toEqual(0.1);
  });
});

describe('calculateImportance', () => {
  it('should calculate the importance based on slider value and criterion scales', () => {
    const result = calculateImportance(0.5, [0, 1]);
    expect(result).toEqual(50);
  });

  it('should return 100 for the initial slider value for unfavorable criteria', () => {
    const result = calculateImportance(0, [0, 1]);
    expect(result).toEqual(100);
  });
});

describe('buildOrdinalPreferences', () => {
  const answers: IRankingAnswer[] = [
    {criterionId: 'critId1', rank: 1},
    {criterionId: 'critId2', rank: 2}
  ];
  const result: IOrdinalRanking[] = buildOrdinalPreferences(answers);
  const expectedResult: IOrdinalRanking[] = [
    {type: 'ordinal', criteria: ['critId1', 'critId2']}
  ];
  expect(result).toEqual(expectedResult);
});
