import {applyOrdering} from './workspaceServiceUtil';

describe('workspaceServiceUtil', () => {
  describe('applyOrdering', () => {
    it('should order an array by the provided ordering of ids', () => {
      const ordering: string[] = ['1', '2', '3'];
      const objectsToOrder = [{id: '3'}, {id: '1'}, {id: '2'}];
      const result = applyOrdering(ordering, objectsToOrder);
      const expectedResult = [{id: '1'}, {id: '2'}, {id: '3'}];
      expect(result).toEqual(expectedResult);
    });

    it('should not change an array if there is no ordering provided', () => {
      const ordering: string[] = undefined;
      const objectsToOrder = [{id: '3'}, {id: '1'}, {id: '2'}];
      const result = applyOrdering(ordering, objectsToOrder);
      expect(result).toEqual(objectsToOrder);
    });
  });
});
