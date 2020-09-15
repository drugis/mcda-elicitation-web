import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import _ from 'lodash';
import {buildElicitationCriteria, getBest, getWorst} from './ElicitationUtil';
import IElicitationCriterion from './Interface/IElicitationCriterion';
import IInputCriterion from './Interface/IInputCriterion';

const criteria: Record<string, IElicitationCriterion> = {
  critId1: {
    id: 'critId1',
    title: 'title',
    scales: [0, 1],
    unitOfMeasurement: {type: UnitOfMeasurementType.custom, label: ''},
    pvfDirection: 'increasing',
    description: 'description'
  },
  critId2: {
    id: 'critId2',
    title: 'title',
    scales: [0, 1],
    unitOfMeasurement: {type: UnitOfMeasurementType.custom, label: ''},
    pvfDirection: 'increasing',
    description: 'description'
  },
  critId3: {
    id: 'critId3',
    title: 'title',
    scales: [0, 1],
    unitOfMeasurement: {type: UnitOfMeasurementType.custom, label: ''},
    pvfDirection: 'increasing',
    description: 'description'
  }
};

describe('getWorst', () => {
  it('should return the minimal value for a linear increasing PVF', () => {
    const criterion = _.merge({}, criteria['critId1'], {
      pvfDirection: 'increasing'
    });
    const result = getWorst(criterion);
    const expectedResult = 0;
    expect(result).toEqual(expectedResult);
  });

  it('should return maximal value for a linear decreasing PVF', () => {
    const criterion = _.merge({}, criteria['critId1'], {
      pvfDirection: 'decreasing'
    });
    const result = getWorst(criterion);
    const expectedResult = 1;
    expect(result).toEqual(expectedResult);
  });
});

describe('getBest', () => {
  it('should return the minimal value for a linear decreasing PVF', () => {
    const criterion = _.merge({}, criteria['critId1'], {
      pvfDirection: 'decreasing'
    });
    const result = getBest(criterion);
    const expectedResult = 0;
    expect(result).toEqual(expectedResult);
  });

  it('should return maximal value for a linear increasing PVF', () => {
    const criterion = _.merge({}, criteria['critId1'], {
      pvfDirection: 'increasing'
    });
    const result = getBest(criterion);
    const expectedResult = 1;
    expect(result).toEqual(expectedResult);
  });
});

describe('buildElicitationCriteria', () => {
  it('should map criteria from MCDA to elicitation criteria and key them by id', () => {
    const input: IInputCriterion[] = [
      {
        id: 'critId',
        title: 'title',
        worst: 0,
        best: 1,
        description: 'description',
        isFavourable: true,
        dataSources: [
          {
            id: 'dsId',
            source: 'source',
            scale: [0, 100],
            unitOfMeasurement: {label: '', type: UnitOfMeasurementType.custom},
            pvf: {direction: 'increasing', type: 'linear', range: [0, 100]}
          }
        ]
      }
    ];
    const result: Record<
      string,
      IElicitationCriterion
    > = buildElicitationCriteria(input);
    const expectedResult = {
      critId: {
        id: input[0].id,
        title: input[0].title,
        scales: [input[0].worst, input[0].best],
        unitOfMeasurement: input[0].dataSources[0].unitOfMeasurement,
        pvfDirection: input[0].dataSources[0].pvf.direction,
        description: input[0].description
      }
    };
    expect(result).toEqual(expectedResult);
  });
});
