import IPreference from './IPreference';

export default interface IExactSwingRatio extends IPreference {
  type: 'exact swing';
  criteria: [string, string];
  ratio: number;
}
