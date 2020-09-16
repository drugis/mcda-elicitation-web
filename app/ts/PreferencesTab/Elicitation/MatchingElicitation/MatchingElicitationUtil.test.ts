import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import {
  calculateImportance,
  determineStepSize,
  getCurrentCriterion,
  getMatchingStatement
} from './MatchingElicitationUtil';

const criteria: Record<string, IPreferencesCriterion> = {
  critId1: {
    id: 'critId1',
    title: 'title1',
    dataSourceId: 'ds1',
    unitOfMeasurement: {type: UnitOfMeasurementType.custom, label: ''},
    description: 'description'
  },
  critId2: {
    id: 'critId2',
    title: 'title2',
    dataSourceId: 'ds2',
    unitOfMeasurement: {type: UnitOfMeasurementType.custom, label: ''},
    description: 'description'
  },
  critId3: {
    id: 'critId3',
    title: 'title3',
    dataSourceId: 'ds3',
    unitOfMeasurement: {type: UnitOfMeasurementType.custom, label: ''},
    description: 'description'
  }
};

describe('determineStepSize', () => {
  it('should return the step size based on the criterion scale', () => {
    const result = determineStepSize([0, 1]);
    expect(result).toEqual(0.1);
  });
});

describe('calculateImportance', () => {
  it('should calculate the importance based on slider value and criterion scale', () => {
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
    const result: IPreferencesCriterion = getCurrentCriterion(
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
