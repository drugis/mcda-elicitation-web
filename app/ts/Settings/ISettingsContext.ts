import ISettings from '@shared/interface/Settings/ISettings';
import IToggledColumns from '@shared/interface/Settings/IToggledColumns';
import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import {TScalesCalculationMethod} from '@shared/interface/Settings/TScalesCalculationMethod';

export default interface ISettingsContext {
  scalesCalculationMethod: TScalesCalculationMethod;
  showPercentages: boolean;
  displayMode: TDisplayMode;
  hasNoEffects: boolean;
  hasNoDistributions: boolean;
  isRelativeProblem: boolean;
  randomSeed: number;
  settings: ISettings;
  showDescriptions: boolean;
  showUnitsOfMeasurement: boolean;
  showReferences: boolean;
  showStrengthsAndUncertainties: boolean;
  numberOfToggledColumns: number;
  toggledColumns: IToggledColumns;
  updateSettings: (
    updatedSettings: ISettings,
    updatedToggledColumns: IToggledColumns
  ) => void;
}
