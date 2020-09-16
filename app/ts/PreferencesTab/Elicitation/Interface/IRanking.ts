import IPreference from './IPreference';

export default interface IRanking extends IPreference {
  type: 'ordinal';
  criteria: [string, string];
}
