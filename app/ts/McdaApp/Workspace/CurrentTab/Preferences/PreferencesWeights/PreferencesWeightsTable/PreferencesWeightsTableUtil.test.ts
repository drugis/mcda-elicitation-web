import ICriterion from '@shared/interface/ICriterion';
import IExactSwingRatio from '@shared/interface/Scenario/IExactSwingRatio';
import IRanking from '@shared/interface/Scenario/IRanking';
import IRatioBoundConstraint from '@shared/interface/Scenario/IRatioBoundConstraint';
import {buildImportances} from './PreferencesWeightsTableUtil';

describe('buildImportance', () => {
  const criteria: ICriterion[] = [
    {
      id: 'critId1'
    } as ICriterion,
    {
      id: 'critId2'
    } as ICriterion
  ];

  it('should return "?" if there are no preferences', () => {
    const result = buildImportances(criteria, []);
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
    const result = buildImportances(criteria, preferences);
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
    const result = buildImportances(criteria, preferences);
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
    const result = buildImportances(criteria, preferences);
    const expectedResult: Record<string, string> = {
      critId1: '100%',
      critId2: '1-100%'
    };
    expect(result).toEqual(expectedResult);
  });
});
