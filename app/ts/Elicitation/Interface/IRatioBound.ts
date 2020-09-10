import IPreference from './IPreference';

export default interface IRatioBound extends IPreference {
  type: 'ratio bound';
  criteria: [string, string];
  bounds: [number, number];
}
