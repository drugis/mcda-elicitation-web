import {initInclusions} from './AddSubproblemButton/AddSubproblemUtil';

describe('AddSubproblemUtil', () => {
  describe('initInclusions', () => {
    it('should initialise everything to true if there are no exclusions', () => {
      const criteria = {
        crit1Id: {
          id: 'crit1Id'
        },
        crit2Id: {
          id: 'crit2Id'
        }
      };
      const expectedResult = {
        crit1Id: true,
        crit2Id: true
      };
      const result = initInclusions(criteria);
      expect(result).toEqual(expectedResult);
    });
    it('should initialise inclusions to false if they are excluded', () => {
      const criteria = {
        crit1Id: {
          id: 'crit1Id'
        },
        crit2Id: {
          id: 'crit2Id'
        }
      };
      const exclusions = ['crit2Id'];
      const expectedResult = {
        crit1Id: true,
        crit2Id: false
      };
      const result = initInclusions(criteria, exclusions);
      expect(result).toEqual(expectedResult);
    });
  });
});
