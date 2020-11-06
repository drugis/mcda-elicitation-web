import {UnitOfMeasurementType} from './IUnitOfMeasurement';
import {IRelative} from './Problem/IProblemRelativePerformance';

type TRelativePerformanceType =
  | 'relative-identity-normal'
  | 'relative-logit-normal'
  | 'relative-log-normal'
  | 'relative-cloglog-normal'
  | 'relative-smd-normal'
  | 'relative-normal'
  | 'relative-survival';

type TBaseline =
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

export default interface IRelativePerformance {
  dataSourceId: string;
  criterionId: string;
  unitOfMeasurementType?: UnitOfMeasurementType;
  type: TRelativePerformanceType;
  baseline: {
    type: TBaseline;
    id: string;
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
  };
  relative: IRelative;
}
