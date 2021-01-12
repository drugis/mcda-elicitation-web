import IAlternative from '@shared/interface/IAlternative';
import {generateLegendTooltip} from './LegendUtil';

describe('LegendUtil', () => {
  describe('generateLegendTooltip', () => {
    const alternatives: IAlternative[] = [
      {id: 'alt1Id', title: 'alt1'},
      {id: 'alt2Id', title: 'alt2'}
    ];
    it('should return a table with a  prompt to click if there is a legend and user can edit', () => {
      const legend: Record<string, string> = {
        alt1Id: 'Final',
        alt2Id: 'smasher'
      };
      const canEdit = true;
      const result = generateLegendTooltip(alternatives, legend, canEdit);
    });
  });
});
