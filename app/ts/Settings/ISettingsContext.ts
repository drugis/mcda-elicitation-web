import IToggledColumns from '@shared/interface/IToggledColumns';
import ISettings from '@shared/interface/Settings/ISettings';
import {TAnalysisType} from '@shared/interface/Settings/TAnalysisType';
import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import {TScalesCalculationMethod} from '@shared/interface/Settings/TScalesCalculationMethod';

export default interface ISettingsContext {
  scalesCalculationMethod: TScalesCalculationMethod;
  showPercentages: boolean;
  displayMode: TDisplayMode;
  analysisType: TAnalysisType;
  hasNoEffects: boolean;
  hasNoDistributions: boolean;
  isRelativeProblem: boolean;
  randomSeed: number;
  showDescriptions: boolean;
  showUnitsOfMeasurement: boolean;
  showReferences: boolean;
  showStrengthsAndUncertainties: boolean;
  numberOfToggledColumns: number;
  updateSettings: (
    updatedSettings: Omit<
      ISettings,
      'isRelativeProblem' | 'hasNoEffects' | 'hasNoDistributions'
    >,
    updatedToggledColumns: IToggledColumns
  ) => void;
}
