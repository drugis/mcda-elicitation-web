import IAlternative from '@shared/interface/IAlternative';
import {initLegend} from './LegendUtil';

describe('LegendUtil', () => {
  describe('initLegend', () => {
    it('should return the existing legend', () => {
      const legend: Record<string, string> = {alt1Id: 'Doge'};
      const alternatives: IAlternative[] = [];
      const result = initLegend(legend, alternatives);
      expect(result).toEqual(legend);
    });

    it('should return alternative titles keyed by id', () => {
      const legend: Record<string, string> = undefined;
      const alternatives: IAlternative[] = [{id: 'alt1Id', title: 'alt1'}];
      const result = initLegend(legend, alternatives);
      const expectedResult: Record<string, string> = {alt1Id: 'alt1'};
      expect(result).toEqual(expectedResult);
    });
  });
});
