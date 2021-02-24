export type TBaseline =
  | 'dnorm'
  | 'dsurv'
  | 'dbeta-logit'
  | 'dbeta-cloglog'
  | 'dt'
  | 'identity'
  | 'logit'
  | 'log'
  | 'cloglog'
  | 'smd';

export default interface IBaseline {
  type: TBaseline;
  name: string;
  mu?: number;
  sigma?: number;
  distribution?: 'Normal' | 'Beta' | 'Gamma';
  title?: string;
  property?: 'log odds ratio' | 'mean difference' | 'log hazard ratio';
  alpha?: number;
  beta?: number;
  summaryMeasure?: 'none' | 'median' | 'mean' | 'survivalAtTime';
  survivalAtTime?: number;
  scale?: 'mean difference' | 'hazard ratio' | 'hazard' | 'log odds' | 'mean';
  'std.err'?: number;
  stdErr?: number;
  mean?: number;
  dof?: number;
}
