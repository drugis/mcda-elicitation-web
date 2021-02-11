import IToggledColumns from '@shared/interface/Settings/IToggledColumns';
import {
  calculateNumberOfToggledColumns,
  getDisplayMode,
  getInitialDisplayMode
} from './SettingsUtil';

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
    it('should return smaaValues if the problem is relative and display mode is enteredDistributions', () => {
      const isRelativeProblem = true;
      const displayMode = 'enteredDistributions';
      const result = getDisplayMode(isRelativeProblem, displayMode);
      expect(result).toEqual('smaaValues');
    });

    it('should return smaaValues if the problem is relative and display mode is enteredEffects', () => {
      const isRelativeProblem = true;
      const displayMode = 'enteredEffects';
      const result = getDisplayMode(isRelativeProblem, displayMode);
      expect(result).toEqual('smaaValues');
    });

    it('should return the set display mode if the settings is legal', () => {
      const isRelativeProblem = true;
      const displayMode = 'deterministicValues';
      const result = getDisplayMode(isRelativeProblem, displayMode);
      expect(result).toEqual('deterministicValues');
    });
  });

  describe('getInitialDisplayMode', () => {
    it('should return smaaValues if the problem is relative', () => {
      const isRelativeProblem = true;
      const hasNoEffect = false;
      const result = getInitialDisplayMode(isRelativeProblem, hasNoEffect);
      expect(result).toEqual('smaaValues');
    });

    it('should return enteredDistributions if the problem has no effects', () => {
      const isRelativeProblem = false;
      const hasNoEffect = true;
      const result = getInitialDisplayMode(isRelativeProblem, hasNoEffect);
      expect(result).toEqual('enteredDistributions');
    });

    it('should return enteredEffects in the other case', () => {
      const isRelativeProblem = false;
      const hasNoEffect = false;
      const result = getInitialDisplayMode(isRelativeProblem, hasNoEffect);
      expect(result).toEqual('enteredEffects');
    });
  });
});
