import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import IRatioBound from '../Interface/IRatioBound';
import {buildInitialImprecisePreferences} from './ImpreciseSwingElicitationUtil';

const criteria: Record<string, IPreferencesCriterion> = {
  critId1: {
    id: 'critId1',
    title: 'title1',
    dataSourceId: 'ds1',
    scale: [0, 1],
    unitOfMeasurement: {type: UnitOfMeasurementType.custom, label: ''},
    description: 'description'
  },
  critId2: {
    id: 'critId2',
    title: 'title2',
    dataSourceId: 'ds2',
    scale: [0, 1],
    unitOfMeasurement: {type: UnitOfMeasurementType.custom, label: ''},
    description: 'description'
  },
  critId3: {
    id: 'critId3',
    title: 'title3',
    dataSourceId: 'ds3',
    scale: [0, 1],
    unitOfMeasurement: {type: UnitOfMeasurementType.custom, label: ''},
    description: 'description'
  }
};

describe('buildInitialImprecisePreferences', () => {
  it('should set criteria ratios to 1 except for the most important criterion', () => {
    const result: Record<
      string,
      IRatioBound
    > = buildInitialImprecisePreferences(criteria, 'critId1');
    const expectedResult: Record<string, IRatioBound> = {
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
