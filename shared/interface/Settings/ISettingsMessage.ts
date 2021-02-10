import IToggledColumns from '../IToggledColumns';
import ISettings from './ISettings';

export default interface ISettingsMessage {
  toggledColumns: IToggledColumns;
  settings: ISettings;
}
