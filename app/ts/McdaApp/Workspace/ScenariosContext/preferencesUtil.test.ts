import ICriterion from '@shared/interface/ICriterion';
import IWeights from '@shared/interface/IWeights';
import {TPvf} from '@shared/interface/Problem/IPvf';
import {ILinearPvf} from '@shared/interface/Pvfs/ILinearPvf';
import {IPieceWiseLinearPvf} from '@shared/interface/Pvfs/IPieceWiseLinearPvf';
import IExactSwingRatio from '@shared/interface/Scenario/IExactSwingRatio';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import IRanking from '@shared/interface/Scenario/IRanking';
import IRatioBoundConstraint from '@shared/interface/Scenario/IRatioBoundConstraint';
import IScenarioProblem from '@shared/interface/Scenario/IScenarioProblem';
import IScenarioState from '@shared/interface/Scenario/IScenarioState';
import {TScenarioPvf} from '@shared/interface/Scenario/TScenarioPvf';
import {TPreferences} from '@shared/types/preferences';
import {
  areAllPvfsSet,
  buildScenarioWithPreferences,
  calculateWeightsFromPreferences,
  createScenarioWithPvf,
  determineElicitationMethod,
  filterScenariosWithPvfs,
  hasNonLinearPvf,
  initPvfs,
  isElicitationView,
  isPieceWiseLinearPvf
} from './preferencesUtil';

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
    it('should return a map of string id to the corresponding pvf with configured ranges', () => {
      const criteria: ICriterion[] = [criterion1, criterion2, criterion3];

      const currentScenario: IMcdaScenario = {
        id: 'scenarioId1',
        title: 'scenario 1',
        state: {
          prefs: [],
          thresholdValuesByCriterion: {},
          problem: {
            criteria: {
              crit1Id: {
                dataSources: [{pvf: {type: 'linear', direction: 'decreasing'}}]
              },
              crit2Id: {
                dataSources: [
                  {
                    pvf: {
                      type: 'piecewise-linear',
                      direction: 'increasing',
                      values: [0.25, 0.5, 0.75],
                      cutoffs: [1, 2, 3]
                    }
                  }
                ]
              }
            }
          }
        },
        subproblemId: '37',
        workspaceId: '42'
      };

      const ranges: Record<string, [number, number]> = {
        dsId1: [0, 1],
        dsId2: [0, 10]
      };
      const result = initPvfs(criteria, currentScenario, ranges);
      const expectedResult: Record<string, TPvf> = {
        crit1Id: {type: 'linear', direction: 'decreasing', range: [0, 1]},
        crit2Id: {
          type: 'piecewise-linear',
          direction: 'increasing',
          values: [0.25, 0.5, 0.75],
          cutoffs: [1, 2, 3],
          range: [0, 10]
        }
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
          weights: {} as IWeights,
          thresholdValuesByCriterion: {}
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
      const thresholdValuesByCriterion = {};
      const result: IMcdaScenario = buildScenarioWithPreferences(
        scenario,
        preferences,
        thresholdValuesByCriterion
      );
      const expectedResult: IMcdaScenario = {
        id: '1',
        title: 'scenario',
        subproblemId: '10',
        workspaceId: '100',
        state: {
          prefs: preferences,
          problem: {criteria: {}},
          thresholdValuesByCriterion: thresholdValuesByCriterion
        }
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('hasNonLinearPvf', () => {
    it('should return true if there is a nonlinear pvf', () => {
      const pvfs = {
        crit1Id: {
          type: 'linear'
        } as TPvf,
        crit2Id: {
          type: 'piecewise-linear'
        } as TPvf
      };
      expect(hasNonLinearPvf(pvfs)).toBe(true);
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

    it('should return "Ranking" if elicitation method is ranking', () => {
      const preferences: TPreferences = [
        {elicitationMethod: 'ranking'} as IRanking
      ];
      const result = determineElicitationMethod(preferences);
      expect(result).toEqual('Ranking');
    });

    it('should return "Precise Swing Weighting" if elicitation method is precise swing weighting', () => {
      const preferences: TPreferences = [
        {elicitationMethod: 'precise'} as IRanking
      ];
      const result = determineElicitationMethod(preferences);
      expect(result).toEqual('Precise Swing Weighting');
    });

    it('should return "Matching" if elicitation method is matcing', () => {
      const preferences: TPreferences = [
        {elicitationMethod: 'matching'} as IRanking
      ];
      const result = determineElicitationMethod(preferences);
      expect(result).toEqual('Matching');
    });

    it('should return "Imprecise Swing Weighting" if elicitation method is imprecise swing weighting', () => {
      const preferences: TPreferences = [
        {elicitationMethod: 'imprecise'} as IRanking
      ];
      const result = determineElicitationMethod(preferences);
      expect(result).toEqual('Imprecise Swing Weighting');
    });

    it('should return "Threshold" if elicitation method is threshold', () => {
      const preferences: TPreferences = [
        {elicitationMethod: 'threshold'} as IRanking
      ];
      const result = determineElicitationMethod(preferences);
      expect(result).toEqual('Threshold');
    });

    it('should return "Choice-based Matching" if elicitation method is chioce-based matching', () => {
      const preferences: TPreferences = [
        {elicitationMethod: 'choice'} as IRanking
      ];
      const result = determineElicitationMethod(preferences);
      expect(result).toEqual('Choice-based Matching');
    });
  });

  describe('createScenarioWithPvf', () => {
    const currentScenario: IMcdaScenario = {
      id: 'scen1',
      title: 'scenario 1',
      workspaceId: '10',
      subproblemId: '100',
      state: {
        problem: {
          criteria: {
            crit1Id: {
              dataSources: [
                {
                  pvf: {
                    type: 'linear',
                    direction: 'decreasing'
                  }
                }
              ]
            }
          }
        },
        prefs: [],
        thresholdValuesByCriterion: {}
      }
    };

    it('should return a scenario with a newly set linear pvf', () => {
      const pvf: ILinearPvf = {
        type: 'linear',
        direction: 'increasing',
        range: [0, 1]
      };
      const result = createScenarioWithPvf('crit1Id', pvf, currentScenario);
      const expectedResult: IMcdaScenario = {
        id: 'scen1',
        title: 'scenario 1',
        workspaceId: '10',
        subproblemId: '100',
        state: {
          problem: {
            criteria: {
              crit1Id: {
                dataSources: [
                  {
                    pvf: {
                      type: 'linear',
                      direction: 'increasing'
                    }
                  }
                ]
              }
            }
          },
          prefs: [],
          thresholdValuesByCriterion: {}
        }
      };
      expect(result).toEqual(expectedResult);
    });

    it('should return a scenario with a newly set piecewise pvf', () => {
      const pvf: IPieceWiseLinearPvf = {
        type: 'piecewise-linear',
        direction: 'increasing',
        values: [0.25, 0.5, 0.75],
        cutoffs: [0, 1, 2],
        range: [0, 10]
      };
      const result = createScenarioWithPvf('crit1Id', pvf, currentScenario);
      const expectedResult: IMcdaScenario = {
        id: 'scen1',
        title: 'scenario 1',
        workspaceId: '10',
        subproblemId: '100',
        state: {
          problem: {
            criteria: {
              crit1Id: {
                dataSources: [
                  {
                    pvf: {
                      type: 'piecewise-linear',
                      direction: 'increasing',
                      values: [0.25, 0.5, 0.75],
                      cutoffs: [0, 1, 2]
                    }
                  }
                ]
              }
            }
          },
          prefs: [],
          thresholdValuesByCriterion: {}
        }
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('areAllPvfsSet', () => {
    const criteria = [criterion1, criterion2, criterion3];

    it('should true if all criteria have corresponding pvfs', () => {
      const pvfs: Record<string, TPvf> = {
        crit1Id: {
          type: 'linear',
          direction: 'increasing',
          range: [0, 1]
        },
        crit2Id: {
          type: 'linear',
          direction: 'increasing',
          range: [0, 1]
        },
        crit3Id: {
          type: 'piecewise-linear',
          direction: 'increasing',
          values: [0.25, 0.5, 0.75],
          cutoffs: [0.1, 0.2, 0.3],
          range: [0, 1]
        }
      };
      const result = areAllPvfsSet(criteria, pvfs);
      expect(result).toBeTruthy();
    });

    it('should false if there are no pvfs', () => {
      const pvfs: Record<string, TPvf> = undefined;
      const result = areAllPvfsSet(criteria, pvfs);
      expect(result).toBeFalsy();
    });

    it('should false if not all criteria have a pvf', () => {
      const pvfs: Record<string, TPvf> = {
        crit1Id: {
          type: 'linear',
          direction: 'increasing',
          range: [0, 1]
        }
      };
      const result = areAllPvfsSet(criteria, pvfs);
      expect(result).toBeFalsy();
    });

    describe('hasNonLinearPvf', () => {
      it('should return true if there is a nonlinear pvf', () => {
        const pvfs = {
          crit1Id: {
            type: 'linear'
          } as TPvf,
          crit2Id: {
            type: 'piecewise-linear'
          } as TPvf
        };
        expect(hasNonLinearPvf(pvfs)).toBe(true);
      });
    });
  });

  describe('isPieceWiseLinearPvf', () => {
    it('should return true if the pvf is piecewise', () => {
      const pvf: IPieceWiseLinearPvf = {
        cutoffs: [0, 1],
        direction: 'decreasing',
        type: 'piecewise-linear',
        values: [1, 2],
        range: [0, 100]
      };
      expect(isPieceWiseLinearPvf(pvf)).toBeTruthy();
    });

    it('should return false for a linear pvf', () => {
      const pvf: ILinearPvf = {
        direction: 'decreasing',
        type: 'linear',
        range: [0, 100]
      };
      expect(isPieceWiseLinearPvf(pvf)).toBeFalsy();
    });
  });

  describe('isElicitationView', () => {
    it('should return true if the view is precise', () => {
      expect(isElicitationView('precise')).toBeTruthy();
    });

    it('should return true if the view is imprecise', () => {
      expect(isElicitationView('imprecise')).toBeTruthy();
    });

    it('should return true if the view is matching', () => {
      expect(isElicitationView('matching')).toBeTruthy();
    });

    it('should return true if the view is ranking', () => {
      expect(isElicitationView('ranking')).toBeTruthy();
    });

    it('should return true if the view is threshold', () => {
      expect(isElicitationView('threshold')).toBeTruthy();
    });

    it('should return true if the view is choice', () => {
      expect(isElicitationView('choice')).toBeTruthy();
    });

    it('should return false if the view is advancedPvf', () => {
      expect(isElicitationView('advancedPvf')).toBeFalsy();
    });

    it('should return false if the view is preferences', () => {
      expect(isElicitationView('preferences')).toBeFalsy();
    });
  });

  describe('hasNonLinearPvf', () => {
    it('should return true if there is at least one piecewise pvf', () => {
      const pvfs: Record<string, TPvf> = {
        crit1Id: {type: 'linear'} as ILinearPvf,
        crit2Id: {type: 'piecewise-linear'} as IPieceWiseLinearPvf
      };
      expect(hasNonLinearPvf(pvfs)).toBeTruthy();
    });

    it('should return false if there is no piecewise pvf', () => {
      const pvfs: Record<string, TPvf> = {
        crit1Id: {type: 'linear'} as ILinearPvf,
        crit2Id: {type: 'linear'} as ILinearPvf
      };
      expect(hasNonLinearPvf(pvfs)).toBeFalsy();
    });
  });

  describe('calculateWeightsFromPreferences', () => {
    const criteria: ICriterion[] = [
      {id: 'crit1Id'} as ICriterion,
      {id: 'crit2Id'} as ICriterion,
      {id: 'crit3Id'} as ICriterion,
      {id: 'crit4Id'} as ICriterion
    ];

    it('should return equal weights if no preferences are set', () => {
      const preferences: TPreferences = [];
      const result = calculateWeightsFromPreferences(criteria, preferences);
      const weights: Record<string, number> = {
        crit1Id: 0.25,
        crit2Id: 0.25,
        crit3Id: 0.25,
        crit4Id: 0.25
      };
      const expectedResult: IWeights = {
        '2.5%': weights,
        mean: weights,
        '97.5%': weights
      };
      expect(result).toEqual(expectedResult);
    });

    it('should return weights for ranking if the preferences are ordinal', () => {
      const preferences: IRanking[] = [
        {
          type: 'ordinal',
          criteria: ['crit1Id', 'crit2Id'],
          elicitationMethod: 'ranking'
        },
        {
          type: 'ordinal',
          criteria: ['crit2Id', 'crit3Id'],
          elicitationMethod: 'ranking'
        },
        {
          type: 'ordinal',
          criteria: ['crit3Id', 'crit4Id'],
          elicitationMethod: 'ranking'
        }
      ];
      const result = calculateWeightsFromPreferences(criteria, preferences);
      const weights: Record<string, number> = {
        crit1Id: 0.5208333333333333,
        crit2Id: 0.2708333333333333,
        crit3Id: 0.14583333333333331,
        crit4Id: 0.0625
      };
      const expectedResult: IWeights = {
        '2.5%': weights,
        mean: weights,
        '97.5%': weights
      };
      expect(result).toEqual(expectedResult);
    });

    it('should return weights for exact preferences', () => {
      const preferences: IExactSwingRatio[] = [
        {
          type: 'exact swing',
          criteria: ['crit1Id', 'crit2Id'],
          elicitationMethod: 'precise',
          ratio: 2
        },
        {
          type: 'exact swing',
          criteria: ['crit1Id', 'crit3Id'],
          elicitationMethod: 'precise',
          ratio: 3
        },
        {
          type: 'exact swing',
          criteria: ['crit1Id', 'crit4Id'],
          elicitationMethod: 'precise',
          ratio: 4
        }
      ];
      const result = calculateWeightsFromPreferences(criteria, preferences);
      const weights: Record<string, number> = {
        crit1Id: 0.4800000000000001, // rounding errors
        crit2Id: 0.24000000000000005,
        crit3Id: 0.16,
        crit4Id: 0.12000000000000002
      };
      const expectedResult: IWeights = {
        '2.5%': weights,
        mean: weights,
        '97.5%': weights
      };
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error for other elicitation types', () => {
      const preferences: IRatioBoundConstraint[] = [
        {
          type: 'ratio bound',
          criteria: ['crit1Id', 'crit2Id'],
          elicitationMethod: 'imprecise',
          bounds: [0, 2]
        }
      ];
      const error = 'Cannot calculate weights from set preferences';
      expect(() => {
        calculateWeightsFromPreferences(criteria, preferences);
      }).toThrow(error);
    });
  });
});
