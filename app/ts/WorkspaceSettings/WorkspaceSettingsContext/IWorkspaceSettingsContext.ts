import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import {TPercentageOrDecimal} from '@shared/interface/Settings/TPercentageOrDecimal';
import {TScalesCalculationMethod} from '@shared/interface/Settings/TScalesCalculationMethod';

export default interface IWorkspaceSettingsContext {
  isSaveButtonDisabled: boolean;
  localShowPercentages: TPercentageOrDecimal;
  localScalesCalculationMethod: TScalesCalculationMethod;
  localDisplayMode: TDisplayMode;
  localRandomSeed: number;
  localShowDescriptions: boolean;
  localShowUnitsOfMeasurement: boolean;
  localShowReferences: boolean;
  localShowStrengthsAndUncertainties: boolean;
  resetToDefaults: () => void;
  saveSettings: () => void;
  setLocalShowPercentages: (newSetting: TPercentageOrDecimal) => void;
  setLocalScalesCalculationMethod: (
    newSetting: TScalesCalculationMethod
  ) => void;
  setLocalDisplayMode: (newSetting: TDisplayMode) => void;
  setLocalRandomSeed: (newSeed: number) => void;
  setLocalShowDescriptions: (newValue: boolean) => void;
  setLocalShowUnitsOfMeasurement: (newValue: boolean) => void;
  setLocalShowReferences: (newValue: boolean) => void;
  setLocalShowStrengthsAndUncertainties: (newValue: boolean) => void;
  setIsSaveButtonDisabled: (newValue: boolean) => void;
}
