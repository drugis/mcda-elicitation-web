import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import IRatioBoundConstraint from '@shared/interface/Scenario/IRatioBoundConstraint';
import {buildInitialImprecisePreferences} from './ImpreciseSwingElicitationUtil';

const criteria: Record<string, IPreferencesCriterion> = {
  critId1: {
    id: 'critId1',
    title: 'title1',
    dataSourceId: 'ds1',
    unitOfMeasurement: {
      type: 'custom',
      label: ''
    },
    description: 'description'
  },
  critId2: {
    id: 'critId2',
    title: 'title2',
    dataSourceId: 'ds2',
    unitOfMeasurement: {
      type: 'custom',
      label: ''
    },
    description: 'description'
  },
  critId3: {
    id: 'critId3',
    title: 'title3',
    dataSourceId: 'ds3',
    unitOfMeasurement: {
      type: 'custom',
      label: ''
    },
    description: 'description'
  }
};

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
