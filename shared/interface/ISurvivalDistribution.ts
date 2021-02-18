import IDistribution from './IDistribution';

export default interface ISurvivalDistribution extends IDistribution {
  type: 'survival';
  alpha: number;
  beta: number;
  summaryMeasure: 'mean' | 'median' | 'survivalAtTime';
  time?: number;
}
