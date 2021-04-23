import ISettings from '@shared/interface/Settings/ISettings';
import IToggledColumns from '@shared/interface/Settings/IToggledColumns';
import {
  calculateNumberOfToggledColumns,
  getDefaultSettings,
  getDisplayMode,
  getInitialDisplayMode
} from './SettingsUtil';

describe('SettingsUtil', () => {
  describe('calculateNumberOfToggledColumns', () => {
    it('should return the number of columns selected plus one (for the criterion title column)', () => {
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

    it('should return the set display mode if the settings are legal for a relative problem', () => {
      const isRelativeProblem = true;
      const displayMode = 'deterministicValues';
      const result = getDisplayMode(isRelativeProblem, displayMode);
      expect(result).toEqual('deterministicValues');
    });
  });

  describe('getInitialDisplayMode', () => {
    it('should return smaaValues if the problem is relative and there are effects', () => {
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

    it('should return smaaValues if the problem is relative and there are no effects', () => {
      const isRelativeProblem = true;
      const hasNoEffect = true;
      const result = getInitialDisplayMode(isRelativeProblem, hasNoEffect);
      expect(result).toEqual('smaaValues');
    });

    it('should return enteredEffects in the other case', () => {
      const isRelativeProblem = false;
      const hasNoEffect = false;
      const result = getInitialDisplayMode(isRelativeProblem, hasNoEffect);
      expect(result).toEqual('enteredEffects');
    });
  });

  describe('getDefaultSettings', () => {
    it('should return the default settings and toggledColumns', () => {
      const isRelativeProblem: boolean = false;
      const hasNoEffects: boolean = false;
      const result = getDefaultSettings(isRelativeProblem, hasNoEffects);
      const expectedResult: {
        defaultSettings: ISettings;
        defaultToggledColumns: IToggledColumns;
      } = {
        defaultSettings: {
          displayMode: 'enteredEffects',
          randomSeed: 1234,
          calculationMethod: 'median',
          showPercentages: 'percentage'
        },
        defaultToggledColumns: {
          references: true,
          strength: true,
          units: true,
          description: true
        }
      };
      expect(result).toEqual(expectedResult);
    });
  });
});
