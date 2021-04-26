import IAlternative from '@shared/interface/IAlternative';
import {generateSingleLetterLegend, initLegend} from './LegendUtil';

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

  describe('generateSingleLetterLegend', () => {
    it('should return a map of alternative ids and single letters', () => {
      const alternatives: IAlternative[] = [
        {id: '1', title: 'alt1'},
        {id: '2', title: 'alt2'}
      ];
      const result = generateSingleLetterLegend(alternatives);
      const exptectedResult = {1: 'A', 2: 'B'};
      expect(result).toEqual(exptectedResult);
    });
  });
});
