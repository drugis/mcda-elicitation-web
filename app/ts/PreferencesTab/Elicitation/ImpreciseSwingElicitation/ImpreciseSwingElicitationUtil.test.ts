import ICriterion from '@shared/interface/ICriterion';
import IRatioBoundConstraint from '@shared/interface/Scenario/IRatioBoundConstraint';
import {buildInitialImprecisePreferences} from './ImpreciseSwingElicitationUtil';

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

describe('buildInitialImprecisePreferences', () => {
  it('should set criteria ratios to 1 except for the most important criterion', () => {
    const result: Record<
      string,
      IRatioBoundConstraint
    > = buildInitialImprecisePreferences(criteria, 'critId1');
    const expectedResult: Record<string, IRatioBoundConstraint> = {
      critId2: {
        criteria: ['critId1', 'critId2'],
        elicitationMethod: 'imprecise',
        type: 'ratio bound',
        bounds: [1, 100]
      },
      critId3: {
        criteria: ['critId1', 'critId3'],
        elicitationMethod: 'imprecise',
        type: 'ratio bound',
        bounds: [1, 100]
      }
    };
    expect(result).toEqual(expectedResult);
  });
});
