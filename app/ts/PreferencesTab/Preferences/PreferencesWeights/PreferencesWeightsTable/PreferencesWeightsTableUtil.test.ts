import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import IExactSwingRatio from '@shared/interface/Scenario/IExactSwingRatio';
import IRanking from '@shared/interface/Scenario/IRanking';
import IRatioBoundConstraint from '@shared/interface/Scenario/IRatioBoundConstraint';
import {buildImportance} from './PreferencesWeightsTableUtil';

describe('buildImportance', () => {
  const criteria: Record<string, IPreferencesCriterion> = {
    critId1: {
      id: 'critId1',
      title: 'crit1',
      description: '',
      dataSourceId: 'dsId1',
      unitOfMeasurement: {
        type: 'custom',
        label: ''
      }
    },
    critId2: {
      id: 'critId2',
      title: 'crit2',
      description: '',
      dataSourceId: 'dsId2',
      unitOfMeasurement: {
        type: 'custom',
        label: ''
      }
    }
  };

  it('should return "?" if there are no preferences', () => {
    const result = buildImportance(criteria, []);
    const expectedResult: Record<string, string> = {
      critId1: '?',
      critId2: '?'
    };
    expect(result).toEqual(expectedResult);
  });

  it('should return ranks if preferences are ranked', () => {
    const preferences: IRanking[] = [
      {
        type: 'ordinal',
        criteria: ['critId1', 'critId2'],
        elicitationMethod: 'ranking'
      }
    ];
    const result = buildImportance(criteria, preferences);
    const expectedResult: Record<string, string> = {
      critId1: '1',
      critId2: '2'
    };
    expect(result).toEqual(expectedResult);
  });

  it('should return correct importances for exact swing preferences', () => {
    const preferences: IExactSwingRatio[] = [
      {
        type: 'exact swing',
        criteria: ['critId1', 'critId2'],
        ratio: 2,
        elicitationMethod: 'matching'
      }
    ];
    const result = buildImportance(criteria, preferences);
    const expectedResult: Record<string, string> = {
      critId1: '100%',
      critId2: '50%'
    };
    expect(result).toEqual(expectedResult);
  });

  it('should return correct importances for ratio bound preferences', () => {
    const preferences: IRatioBoundConstraint[] = [
      {
        type: 'ratio bound',
        criteria: ['critId1', 'critId2'],
        bounds: [1, 100],
        elicitationMethod: 'imprecise'
      }
    ];
    const result = buildImportance(criteria, preferences);
    const expectedResult: Record<string, string> = {
      critId1: '100%',
      critId2: '1-100%'
    };
    expect(result).toEqual(expectedResult);
  });
});
