import ISettings from '@shared/interface/Settings/ISettings';
import IToggledColumns from '@shared/interface/Settings/IToggledColumns';

export type TTogglableColumns =
  | 'description'
  | 'units'
  | 'references'
  | 'strength';

export type TSettings =
  | 'calculationMethod'
  | 'displayMode'
  | 'randomSeed'
  | 'showPercentages'
  | 'showCbmPieChart';

export default interface IWorkspaceSettingsContext {
  isSaveButtonDisabled: boolean;
  localSettings: ISettings;
  localToggledColumns: IToggledColumns;
  resetToDefaults: () => void;
  saveSettings: () => void;
  setSetting: (setting: TSettings, value: any) => void;
  setShowColumn: (column: TTogglableColumns, value: boolean) => void;
  setAllColumnsTo: (value: boolean) => void;
  setIsSaveButtonDisabled: (newValue: boolean) => void;
}
