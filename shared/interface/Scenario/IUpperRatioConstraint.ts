export default interface IUpperRatioConstraint {
  type: 'upper ratio';
  bound: number;
  criteria: [string, string];
}
