import {UnitOfMeasurementType} from './IUnitOfMeasurement';
import IBaseline from './Problem/IBaseline';
import {IRelative} from './Problem/IProblemRelativePerformance';

export type TRelativePerformanceType =
  | 'relative-identity-normal'
  | 'relative-logit-normal'
  | 'relative-log-normal'
  | 'relative-cloglog-normal'
  | 'relative-smd-normal'
  | 'relative-normal'
  | 'relative-survival';

export default interface IRelativePerformance {
  dataSourceId: string;
  criterionId: string;
  unitOfMeasurementType?: UnitOfMeasurementType;
  type: TRelativePerformanceType;
  baseline: IBaseline;
  relative: IRelative;
}
