import ICriterion from '@shared/interface/ICriterion';
import IPvf from '@shared/interface/Problem/IPvf';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import IWeights from '@shared/interface/Scenario/IWeights';
import {TPreferences} from '@shared/types/Preferences';
import {buildScenarioWithPreferences, initPvfs} from './PreferencesUtil';

const criterion1: ICriterion = {
  id: 'crit1Id',
  description: '',
  title: 'criterion1',
  isFavourable: true,
  dataSources: [
    {
      id: 'dsId1',
      strengthOfEvidence: '',
      unitOfMeasurement: {
        type: 'custom',
        label: '',
        lowerBound: 0,
        upperBound: 1
      },
      reference: '',
      referenceLink: '',
      uncertainty: ''
    }
  ]
};
const criterion2: ICriterion = {
  id: 'crit2Id',
  description: '',
  title: 'criterion2',
  isFavourable: true,
  dataSources: [
    {
      id: 'dsId2',
      reference: '',
      referenceLink: '',
      strengthOfEvidence: '',
      uncertainty: '',
      unitOfMeasurement: {
        type: 'custom',
        label: '',
        lowerBound: 0,
        upperBound: 1
      }
    }
  ]
};
const criterion3: ICriterion = {
  id: 'crit3Id',
  description: '',
  title: 'criterion3',
  isFavourable: true,
  dataSources: [
    {
      id: 'dsId3',
      reference: '',
      referenceLink: '',
      strengthOfEvidence: '',
      uncertainty: '',
      unitOfMeasurement: {
        type: 'custom',
        label: '',
        lowerBound: 0,
        upperBound: 100
      }
    }
  ]
};

describe('PreferencesUtil', () => {
  describe('initPvfs', () => {
    const criteria: ICriterion[] = [criterion1, criterion2];

    const currentScenario: IMcdaScenario = {
      id: 'scenarioId1',
      title: 'scenario 1',
      state: {
        prefs: [],
        problem: {
          criteria: {
            crit2Id: {
              dataSources: [{pvf: {type: 'linear', direction: 'decreasing'}}]
            }
          }
        }
      },
      subproblemId: '37',
      workspaceId: '42'
    };
    it('should return a map of string id to the corresponding pvf with configured ranges', () => {
      const ranges: Record<string, [number, number]> = {
        dsId1: [0, 1],
        dsId2: [2, 3]
      };
      const observedRanges: Record<string, [number, number]> = {
        dsId1: [10, 11],
        dsId2: [12, 13]
      };
      const result = initPvfs(
        criteria,
        currentScenario,
        ranges,
        observedRanges
      );
      const expectedResult: Record<string, IPvf> = {
        crit1Id: {range: [0, 1]},
        crit2Id: {type: 'linear', direction: 'decreasing', range: [2, 3]}
      };
      expect(result).toEqual(expectedResult);
    });

    it('should return a map of string id to the corresponding pvf with observed ranges', () => {
      const ranges: Record<string, [number, number]> = {};
      const observedRanges: Record<string, [number, number]> = {
        dsId1: [10, 11],
        dsId2: [12, 13]
      };
      const result = initPvfs(
        criteria,
        currentScenario,
        ranges,
        observedRanges
      );
      const expectedResult: Record<string, IPvf> = {
        crit1Id: {range: [10, 11]},
        crit2Id: {type: 'linear', direction: 'decreasing', range: [12, 13]}
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('buildScenarioWithPreferences', () => {
    it('should put preferences on the scenario state and remove the weights', () => {
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
