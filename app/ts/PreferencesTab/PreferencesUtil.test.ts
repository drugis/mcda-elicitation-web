import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IPvf from '@shared/interface/Problem/IPvf';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import IWeights from '@shared/interface/Scenario/IWeights';
import {TPreferences} from '@shared/types/Preferences';
import {
  buildScenarioWithPreferences,
  createPreferencesCriteria,
  initPvfs
} from './PreferencesUtil';

const criterion1: IProblemCriterion = {
  id: 'crit1Id',
  description: '',
  title: 'criterion1',
  dataSources: [
    {
      pvf: {range: [0, 1]},
      id: 'dsId1',
      scale: [11, 12],
      source: '',
      sourceLink: '',
      strengthOfEvidence: '',
      uncertainties: '',
      unitOfMeasurement: {type: UnitOfMeasurementType.custom, label: ''}
    }
  ]
};
const criterion2: IProblemCriterion = {
  id: 'crit2Id',
  description: '',
  title: 'criterion2',
  dataSources: [
    {
      pvf: {range: [2, 3]},
      id: 'dsId2',
      scale: [13, 14],
      source: '',
      sourceLink: '',
      strengthOfEvidence: '',
      uncertainties: '',
      unitOfMeasurement: {type: UnitOfMeasurementType.custom, label: ''}
    }
  ]
};

describe('PreferencesUtil', () => {
  describe('initPvfs', () => {
    it('should return a map of string id to the corresponding pvf', () => {
      const criteria: Record<string, IProblemCriterion> = {
        critId1: criterion1,
        critId2: criterion2
      };

      const currentScenario: IMcdaScenario = {
        id: 'scenarioId1',
        title: 'scenario 1',
        state: {
          prefs: [],
          problem: {
            criteria: {
              critId2: {
                dataSources: [{pvf: {type: 'linear', direction: 'decreasing'}}]
              }
            }
          }
        },
        subproblemId: '37',
        workspaceId: '42'
      };
      const result = initPvfs(criteria, currentScenario);
      const expectedResult: Record<string, IPvf> = {
        critId1: {range: [0, 1]},
        critId2: {type: 'linear', direction: 'decreasing', range: [2, 3]}
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createPreferencesCriteria', () => {
    it('should transform problem criteria into preferences criteria', () => {
      const criteria: Record<string, IProblemCriterion> = {critId1: criterion1};
      const result = createPreferencesCriteria(criteria);
      const expectedResult: Record<string, IPreferencesCriterion> = {
        critId1: {
          title: criterion1.title,
          description: criterion1.description,
          unitOfMeasurement: criterion1.dataSources[0].unitOfMeasurement,
          id: 'critId1',
          dataSourceId: criterion1.dataSources[0].id
        }
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('buildScenarioWithPreferences', () => {
    it('should put preferenes on the scenario state and remove the weights', () => {
      const scenario: IMcdaScenario = {
        id: '1',
        title: 'scenario',
        subproblemId: '10',
        workspaceId: '100',
        state: {
          prefs: [
            {
              elicitationMethod: 'ranking',
              criteria: ['critId1', 'critdI2'],
              type: 'ordinal'
            }
          ],
          problem: {criteria: {}},
          weights: {} as IWeights
        }
      };
      const preferences: TPreferences = [
        {
          elicitationMethod: 'matching',
          type: 'exact swing',
          criteria: ['critId1', 'critdI2'],
          ratio: 1
        }
      ];
      const result: IMcdaScenario = buildScenarioWithPreferences(
        scenario,
        preferences
      );
      const expectedResult: IMcdaScenario = {
        id: '1',
        title: 'scenario',
        subproblemId: '10',
        workspaceId: '100',
        state: {
          prefs: preferences,
          problem: {criteria: {}}
        }
      };
      expect(result).toEqual(expectedResult);
    });
  });
});
