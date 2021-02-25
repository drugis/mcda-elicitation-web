import ICriterion from '@shared/interface/ICriterion';
import {
  calculateImportance,
  determineStepSize,
  getCurrentCriterion,
  getMatchingStatement
} from './MatchingElicitationUtil';

const criteria: ICriterion[] = [
  {
    id: 'critId1',
    title: 'title1'
  } as ICriterion,
  {
    id: 'critId2',
    title: 'title2'
  } as ICriterion,
  {
    id: 'critId3',
    title: 'title3'
  } as ICriterion
];

describe('determineStepSize', () => {
  it('should return the step size based on the criterion scale', () => {
    const result = determineStepSize([0, 1]);
    expect(result).toEqual(0.1);
  });
});

describe('calculateImportance', () => {
  it('should calculate the importance correctly for increasing pvf', () => {
    const result = calculateImportance(0.3, {
      range: [0, 1],
      direction: 'increasing',
      type: 'linear'
    });
    expect(result).toEqual(30);
  });

  it('should calculate the importance correctly for decreasing pvf', () => {
    const result = calculateImportance(0.3, {
      range: [0, 1],
      direction: 'decreasing',
      type: 'linear'
    });
    expect(result).toEqual(70);
  });
});

describe('getCurrentCriterion', () => {
  it('should return the correct criterion for matching', () => {
    const result: ICriterion = getCurrentCriterion(criteria, 'critId1', 2);
    expect(result.id).toEqual('critId2');
  });
});

describe('getMatchingStatement', () => {
  it('should return a complete matching statement', () => {
    const mostImportantCriterion = criteria[0];
    const currentCriterion = criteria[1];
    const result: string = getMatchingStatement(
      mostImportantCriterion,
      currentCriterion
    );

    const expectedResult =
      'How much better should title1 minimally become to justify the worsening of title2?';
    expect(result).toEqual(expectedResult);
  });
});
