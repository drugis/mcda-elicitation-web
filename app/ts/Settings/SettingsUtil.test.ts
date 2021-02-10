import IToggledColumns from '@shared/interface/Settings/IToggledColumns';
import {TAnalysisType} from '@shared/interface/Settings/TAnalysisType';
import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import {calculateNumberOfToggledColumns, getWarning} from './SettingsUtil';

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

  describe('getWarnings', () => {
    it('should return a warning about no entered effects if there are none', () => {
      const displayMode: TDisplayMode = 'enteredData';
      const analysisType: TAnalysisType = 'deterministic';
      const hasNoEffects = true;
      const hasNoDistributions = false;
      const result = getWarning(
        displayMode,
        analysisType,
        hasNoEffects,
        hasNoDistributions
      );
      const expectedResult =
        'No entered data available for deterministic analysis.';
      expect(result).toEqual(expectedResult);
    });

    it('should return a warning about no entered distributions if there are none', () => {
      const displayMode: TDisplayMode = 'enteredData';
      const analysisType: TAnalysisType = 'smaa';
      const hasNoEffects = false;
      const hasNoDistributions = true;
      const result = getWarning(
        displayMode,
        analysisType,
        hasNoEffects,
        hasNoDistributions
      );
      const expectedResult = 'No entered data available for SMAA analysis.';
      expect(result).toEqual(expectedResult);
    });

    it('should return no warning if there is data to display', () => {
      const displayMode: TDisplayMode = 'enteredData';
      const analysisType: TAnalysisType = 'smaa';
      const hasNoEffects = false;
      const hasNoDistributions = false;
      const result = getWarning(
        displayMode,
        analysisType,
        hasNoEffects,
        hasNoDistributions
      );
      const expectedResult = '';
      expect(result).toEqual(expectedResult);
    });
  });
});
