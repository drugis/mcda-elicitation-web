import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import IElicitationCriterion from '../Interface/IElicitationCriterion';
import {
  calculateImportance,
  determineStepSize,
  getCurrentCriterion,
  getMatchingStatement
} from './MatchingElicitationUtil';

const criteria: Record<string, IElicitationCriterion> = {
  critId1: {
    id: 'critId1',
    title: 'title1',
    scales: [0, 1],
    unitOfMeasurement: {type: UnitOfMeasurementType.custom, label: ''},
    pvfDirection: 'increasing',
    description: 'description'
  },
  critId2: {
    id: 'critId2',
    title: 'title2',
    scales: [0, 1],
    unitOfMeasurement: {type: UnitOfMeasurementType.custom, label: ''},
    pvfDirection: 'increasing',
    description: 'description'
  },
  critId3: {
    id: 'critId3',
    title: 'title3',
    scales: [0, 1],
    unitOfMeasurement: {type: UnitOfMeasurementType.custom, label: ''},
    pvfDirection: 'increasing',
    description: 'description'
  }
};

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

describe('getCurrentCriterion', () => {
  it('should return the correct criterion for matching', () => {
    const result: IElicitationCriterion = getCurrentCriterion(
      criteria,
      'critId1',
      2
    );
    expect(result.id).toEqual('critId2');
  });
});

describe('getMatchingStatement', () => {
  it('should return a complete matching statement', () => {
    const mostImportantCriterion = criteria['critId1'];
    const currentCriterion = criteria['critId2'];
    const result: string = getMatchingStatement(
      mostImportantCriterion,
      currentCriterion
    );

    const expectedResult =
      'How much better should title1 minimally become to justify the worsening of title2?';
    expect(result).toEqual(expectedResult);
  });
});
