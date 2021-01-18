import ICriterion from '@shared/interface/ICriterion';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IProblemDataSource from '@shared/interface/Problem/IProblemDataSource';
import IPvf from '@shared/interface/Problem/IPvf';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import IScenarioCriterion from '@shared/interface/Scenario/IScenarioCriterion';
import IWeights from '@shared/interface/Scenario/IWeights';
import {TPreferences} from '@shared/types/Preferences';
import {
  buildScenarioWithPreferences,
  filterScenariosWithPvfs,
  initPvfs
} from './PreferencesUtil';

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
    it('should return a map of string id to the corresponding pvf', () => {
      const criteria: ICriterion[] = [criterion1, criterion2, criterion3];

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
      const ranges: Record<string, [number, number]> = {
        dsId1: [0, 1],
        dsId2: [2, 3]
      };
      const problemCriteria: Record<string, IProblemCriterion> = {
        crit2Id: {
          dataSources: [
            {pvf: {type: 'linear', direction: 'increasing', range: [0, 100]}}
          ]
        } as IProblemCriterion,
        crit3Id: {
          dataSources: [
            {pvf: {type: 'linear', direction: 'increasing', range: [0, 100]}}
          ]
        } as IProblemCriterion
      };
      const result = initPvfs(
        criteria,
        currentScenario,
        ranges,
        problemCriteria
      );
      const expectedResult: Record<string, IPvf> = {
        crit1Id: {range: [0, 1]},
        crit2Id: {type: 'linear', direction: 'decreasing', range: [2, 3]},
        crit3Id: {type: 'linear', direction: 'increasing', range: [0, 100]}
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

  describe('filterScenariosWithPvfs', () => {
    it('should return scenarios that have set pvfs on the scenario', () => {
      const scenarios: Record<string, IMcdaScenario> = {
        scenarioId1: {
          id: 'scenarioId1',
          title: 'scenario 1',
          state: {
            prefs: [],
            problem: {
              criteria: {
                crit1Id: {
                  dataSources: [
                    {pvf: {type: 'linear', direction: 'decreasing'}}
                  ]
                }
              }
            }
          },
          subproblemId: '37',
          workspaceId: '42'
        },
        scenarioId2: {
          id: 'scenarioId2',
          title: 'scenario 2',
          state: {
            prefs: [],
            problem: {
              criteria: {
                crit1Id: {} as IScenarioCriterion
              }
            }
          },
          subproblemId: '37',
          workspaceId: '42'
        }
      };
      const result = filterScenariosWithPvfs(scenarios, {});
      const expectedResult = {
        scenarioId1: scenarios.scenarioId1
      };
      expect(result).toEqual(expectedResult);
    });

    it('should return all scenarios if the pvfs are set on the default problem', () => {
      const scenarios: Record<string, IMcdaScenario> = {
        scenarioId1: {
          id: 'scenarioId1',
          title: 'scenario 1',
          state: {
            prefs: [],
            problem: {
              criteria: {
                crit1Id: {} as IScenarioCriterion
              }
            }
          },
          subproblemId: '37',
          workspaceId: '42'
        },
        scenarioId2: {
          id: 'scenarioId2',
          title: 'scenario 2',
          state: {
            prefs: [],
            problem: {
              criteria: {
                crit1Id: {} as IScenarioCriterion
              }
            }
          },
          subproblemId: '37',
          workspaceId: '42'
        }
      };
      const problemCriteria: Record<string, IProblemCriterion> = {
        crit1Id: {
          dataSources: [
            {
              pvf: {type: 'linear', direction: 'decreasing'} as IPvf
            } as IProblemDataSource
          ]
        } as IProblemCriterion
      };
      const result = filterScenariosWithPvfs(scenarios, problemCriteria);
      expect(result).toEqual(scenarios);
    });
  });
});
