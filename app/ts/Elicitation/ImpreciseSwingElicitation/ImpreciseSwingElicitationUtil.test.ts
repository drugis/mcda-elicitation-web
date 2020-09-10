import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import IElicitationCriterion from '../Interface/IElicitationCriterion';
import IRatioBound from '../Interface/IRatioBound';
import {setInitialImprecisePreferences} from './ImpreciseSwingElicitationUtil';

const criteria: Record<string, IElicitationCriterion> = {
  critId1: {
    id: 'critId1',
    title: 'title1',
    scales: [0, 1],
    unitOfMeasurement: {type: UnitOfMeasurementType.custom, label: ''},
    pvfDirection: 'increasing',
    description: 'description'
  },
  critId2: {
    id: 'critId2',
    title: 'title2',
    scales: [0, 1],
    unitOfMeasurement: {type: UnitOfMeasurementType.custom, label: ''},
    pvfDirection: 'increasing',
    description: 'description'
  },
  critId3: {
    id: 'critId3',
    title: 'title3',
    scales: [0, 1],
    unitOfMeasurement: {type: UnitOfMeasurementType.custom, label: ''},
    pvfDirection: 'increasing',
    description: 'description'
  }
};

describe('setPreferencesToMax', () => {
  it('should set criteria ratios to 1 except for the most important criterion', () => {
    const result: Record<string, IRatioBound> = setInitialImprecisePreferences(
      criteria,
      'critId1'
    );
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
