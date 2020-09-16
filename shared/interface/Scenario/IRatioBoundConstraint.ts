import IPreference from './IPreference';

export default interface IRatioBoundConstraint extends IPreference {
  bounds: [number, number];
  criteria: [string, string];
  type: 'ratio bound';
}
