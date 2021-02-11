import IToggledColumns from '@shared/interface/Settings/IToggledColumns';
import {calculateNumberOfToggledColumns} from './SettingsUtil';

describe('SettingsUtil', () => {
  describe('calculateNumberOfToggledColumns', () => {
    it('should return the number of columns selected plus one', () => {
      const toggledColumns: IToggledColumns = {
        description: true,
        units: true,
        references: true,
        strength: false
      };
      const result = calculateNumberOfToggledColumns(toggledColumns);
      expect(result).toEqual(4);
    });
  });

  describe('getDisplayMode', () => {
    it('should', () => {
      fail();
    });
  });
});
