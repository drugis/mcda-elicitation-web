import IPreference from '@shared/interface/Scenario/IPreference';

export default interface IRanking extends IPreference {
  type: 'ordinal';
  criteria: [string, string];
}
