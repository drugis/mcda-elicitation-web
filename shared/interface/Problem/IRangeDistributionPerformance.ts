export default interface IRangeDistributionPerformance {
  type: 'range';
  parameters: {
    lowerBound: number;
    upperBound: number;
  };
}
