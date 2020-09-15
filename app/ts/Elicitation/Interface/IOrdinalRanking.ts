import IPreference from './IPreference';

export default interface IOrdinalRanking extends IPreference {
  type: 'ordinal';
  criteria: [string, string];
}
