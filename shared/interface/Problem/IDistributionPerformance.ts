import IBetaPerformance from './IBetaPerformance';
import IEmptyPerformance from './IEmptyPerformance';
import IGammaPerformance from './IGammaPerformance';
import INormalPerformance from './INormalPerformance';
import IRangeDistributionPerformance from './IRangeDistributionPerformance';
import IStudentsTPerformance from './IStudentsTPerformance';
import ITextPerformance from './ITextPerformance';
import IValuePerformance from './IValuePerformance';

export type DistributionPerformance =
  | IValuePerformance
  | IRangeDistributionPerformance
  | INormalPerformance
  | IBetaPerformance
  | IGammaPerformance
  | ITextPerformance
  | IEmptyPerformance
  | IStudentsTPerformance;

export type distributionPerformanceType =
  | 'exact'
  | 'dnorm'
  | 'dbeta'
  | 'dgamma'
  | 'range'
  | 'empty'
  | 'dt';
