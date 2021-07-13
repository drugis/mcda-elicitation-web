import IPreference from './IPreference';

export default interface IUpperRatioConstraint extends IPreference {
  type: 'upper ratio';
  bound: number;
  criteria: [string, string];
}
