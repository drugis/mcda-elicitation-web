import {getNextId, getPreviousId, swapItems} from './swapUtil';

describe('swapUtil', () => {
  const items = [{id: '1'}, {id: '2'}, {id: '3'}];

  describe('getNextId', () => {
    it('should return the id of the next item in the provided array', () => {
      const index = 1;
      const result = getNextId(index, items);
      expect(result).toEqual('3');
    });

    it('should return undefined if the index is the last item in the provided array', () => {
      const index = 2;
      const result = getNextId(index, items);
      expect(result).toBeUndefined();
    });
  });

  describe('getPreviousId', () => {
    it('should return the id of the previous item in the provided array', () => {
      const index = 1;
      const result = getPreviousId(index, items);
      expect(result).toEqual('1');
    });

    it('should return undefined if the index is the first item in the provided array', () => {
      const index = 0;
      const result = getPreviousId(index, items);
      expect(result).toBeUndefined();
    });
  });

  describe('swapItems', () => {
    it('should swap two items in a list', () => {
      const items = [{id: '1'}, {id: '2'}];
      const result = swapItems('1', '2', items);
      const expectedResult = [{id: '2'}, {id: '1'}];
      expect(result).toEqual(expectedResult);
    });
  });
});
