import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import IElicitationCriterion from '../Interface/IElicitationCriterion';
import {getPreciseSwingStatement} from './PreciseSwingElicitationUtil';

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

describe('getPreciseSwingStatement', () => {
  it('should return a complete matching statement', () => {
    const result: string = getPreciseSwingStatement(criteria['critId1']);

    const expectedResult =
      "You've indicated that improving title1 from 0  to 1  is the most important (i.e. it has 100% importance). Now indicate the relative importance (in %) to this improvement of each other criterion's improvement using the sliders below.";
    expect(result).toEqual(expectedResult);
  });
});
