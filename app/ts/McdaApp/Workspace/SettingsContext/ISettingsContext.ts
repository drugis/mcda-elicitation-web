import ICriterion from '@shared/interface/ICriterion';
import ISettings from '@shared/interface/Settings/ISettings';
import IToggledColumns from '@shared/interface/Settings/IToggledColumns';

export default interface ISettingsContext {
  hasNoEffects: boolean;
  hasNoDistributions: boolean;
  isRelativeProblem: boolean;
  settings: ISettings;
  numberOfToggledColumns: number;
  showPercentages: boolean;
  toggledColumns: IToggledColumns;
  getUsePercentage: (criterion: ICriterion) => boolean;
  updateSettings: (
    updatedSettings: ISettings,
    updatedToggledColumns: IToggledColumns
  ) => void;
}
