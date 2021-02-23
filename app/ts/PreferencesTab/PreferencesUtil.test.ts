import ICriterion from '@shared/interface/ICriterion';
import {TPvf} from '@shared/interface/Problem/IPvf';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import IRanking from '@shared/interface/Scenario/IRanking';
import IScenarioProblem from '@shared/interface/Scenario/IScenarioProblem';
import IScenarioState from '@shared/interface/Scenario/IScenarioState';
import IWeights from '@shared/interface/Scenario/IWeights';
import {TScenarioPvf} from '@shared/interface/Scenario/TScenarioPvf';
import {TPreferences} from '@shared/types/Preferences';
import {
  buildScenarioWithPreferences,
  determineElicitationMethod,
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
    const criteria: ICriterion[] = [criterion1];

    const currentScenario: IMcdaScenario = {
      id: 'scenarioId1',
      title: 'scenario 1',
      state: {
        prefs: [],
        problem: {
          criteria: {
            crit1Id: {
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
        dsId1: [0, 1]
      };
      const observedRanges: Record<string, [number, number]> = {
        dsId1: [10, 11]
      };
      const result = initPvfs(
        criteria,
        currentScenario,
        ranges,
        observedRanges
      );
      const expectedResult: Record<string, TPvf> = {
        crit1Id: {type: 'linear', direction: 'decreasing', range: [0, 1]}
      };
      expect(result).toEqual(expectedResult);
    });

    it('should return a map of string id to the corresponding pvf with observed ranges', () => {
      const ranges: Record<string, [number, number]> = {};
      const observedRanges: Record<string, [number, number]> = {
        dsId1: [10, 11]
      };
      const result = initPvfs(
        criteria,
        currentScenario,
        ranges,
        observedRanges
      );
      const expectedResult: Record<string, TPvf> = {
        crit1Id: {type: 'linear', direction: 'decreasing', range: [10, 11]}
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

  describe('filterScenariosWithPvfs', () => {
    it('should filter out all the scenarios without pvfs for every criterion', () => {
      const scenarios = {
        scenarioWithPvfs: {
          id: 'scenarioWithPvfs',
          state: {
            problem: {
              criteria: {
                crit1Id: {
                  dataSources: [
                    {pvf: {direction: 'decreasing'} as TScenarioPvf}
                  ]
                },
                crit2Id: {
                  dataSources: [
                    {pvf: {direction: 'decreasing'} as TScenarioPvf}
                  ]
                }
              }
            } as IScenarioProblem
          } as IScenarioState
        } as IMcdaScenario,
        scenarioWithSomePvfs: {
          id: 'scenarioWithSomePvfs',
          state: {
            problem: {
              criteria: {
                crit1Id: {
                  dataSources: [
                    {pvf: {direction: 'increasing'} as TScenarioPvf}
                  ]
                },
                crit2Id: {
                  dataSources: [{pvf: {} as TScenarioPvf}]
                }
              }
            } as IScenarioProblem
          } as IScenarioState
        } as IMcdaScenario,
        scenarioWithNoPvfs: {
          id: 'scenarioWithNoPvfs',
          state: {
            problem: {
              criteria: {}
            } as IScenarioProblem
          } as IScenarioState
        } as IMcdaScenario
      };

      const criteria = [
        {id: 'crit1Id'} as ICriterion,
        {id: 'crit2Id'} as ICriterion
      ];

      const result = filterScenariosWithPvfs(scenarios, criteria);

      const expectedResult: Record<string, IMcdaScenario> = {
        scenarioWithPvfs: {
          id: 'scenarioWithPvfs',
          state: {
            problem: {
              criteria: {
                crit1Id: {
                  dataSources: [
                    {pvf: {direction: 'decreasing'} as TScenarioPvf}
                  ]
                },
                crit2Id: {
                  dataSources: [
                    {pvf: {direction: 'decreasing'} as TScenarioPvf}
                  ]
                }
              }
            } as IScenarioProblem
          } as IScenarioState
        } as IMcdaScenario
      };

      expect(result).toEqual(expectedResult);
    });
  });

  describe('determineElicitationMethod', () => {
    it('should return "None" if preferences are not set', () => {
      const preferences: TPreferences = [];
      const result = determineElicitationMethod(preferences);
      expect(result).toEqual('None');
    });

    it('should return "Ranking"', () => {
      const preferences: TPreferences = [
        {elicitationMethod: 'ranking'} as IRanking
      ];
      const result = determineElicitationMethod(preferences);
      expect(result).toEqual('Ranking');
    });

    it('should return "Precise Swing Weighting"', () => {
      const preferences: TPreferences = [
        {elicitationMethod: 'precise'} as IRanking
      ];
      const result = determineElicitationMethod(preferences);
      expect(result).toEqual('Precise Swing Weighting');
    });

    it('should return "Matching"', () => {
      const preferences: TPreferences = [
        {elicitationMethod: 'matching'} as IRanking
      ];
      const result = determineElicitationMethod(preferences);
      expect(result).toEqual('Matching');
    });

    it('should return "Imprecise Swing Weighting"', () => {
      const preferences: TPreferences = [
        {elicitationMethod: 'imprecise'} as IRanking
      ];
      const result = determineElicitationMethod(preferences);
      expect(result).toEqual('Imprecise Swing Weighting');
    });
  });

  describe('createScenarioWithPvf', () => {
    it('should', () => {
      fail();
    });
  });
});
