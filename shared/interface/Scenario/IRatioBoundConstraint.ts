export default interface IRatioBoundConstraint {
  bounds: [number, number];
  criteria: [string, string];
  type: 'ratio bound';
}
