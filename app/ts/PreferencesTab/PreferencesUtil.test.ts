import {initPvfs, createPreferencesCriteria} from './PreferencesUtil';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import IScenario from '@shared/interface/Scenario/IScenario';
import IPvf from '@shared/interface/Problem/IPvf';
import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';

const criterion1: IProblemCriterion = {
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

      const currentScenario: IScenario = {
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
          scale: criterion1.dataSources[0].scale,
          id: 'critId1',
          dataSourceId: criterion1.dataSources[0].id
        }
      };
      expect(result).toEqual(expectedResult);
    });
  });
});
