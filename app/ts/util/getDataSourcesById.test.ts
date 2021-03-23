import ICriterion from '@shared/interface/ICriterion';
import {getDataSourcesById} from './getDataSourcesById';

describe('getDataSourcesById', () => {
  it('should return the data sources of all criteria keyed by id', () => {
    const criteria = {
      crit1: {dataSources: [{id: 'ds1'}, {id: 'ds2'}]} as ICriterion,
      crit2: {dataSources: [{id: 'ds3'}]} as ICriterion
    };
    const result = getDataSourcesById(criteria);
    const expectedResult = {
      ds1: {id: 'ds1'},
      ds2: {id: 'ds2'},
      ds3: {id: 'ds3'}
    };
    expect(result).toEqual(expectedResult);
  });
});
