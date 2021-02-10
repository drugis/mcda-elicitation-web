import ISettings from './ISettings';
import IToggledColumns from './IToggledColumns';

export default interface ISettingsMessage {
  toggledColumns: IToggledColumns;
  settings: ISettings;
}
