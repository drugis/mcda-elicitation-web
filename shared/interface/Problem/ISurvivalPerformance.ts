export default interface ISurvivalPerformance {
  type: 'dsurv';
  parameters: {
    alpha: number;
    beta: number;
    summaryMeasure: 'mean' | 'median' | 'survivalAtTime';
    time?: number;
  };
}
