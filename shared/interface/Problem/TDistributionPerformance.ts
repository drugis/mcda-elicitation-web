import IBetaPerformance from './IBetaPerformance';
import IEmptyPerformance from './IEmptyPerformance';
import IGammaPerformance from './IGammaPerformance';
import INormalPerformance from './INormalPerformance';
import IRangeDistributionPerformance from './IRangeDistributionPerformance';
import IStudentsTPerformance from './IStudentsTPerformance';
import ISurvivalPerformance from './ISurvivalPerformance';
import ITextPerformance from './ITextPerformance';
import IValuePerformance from './IValuePerformance';

export type TDistributionPerformance =
  | IValuePerformance
  | IRangeDistributionPerformance
  | INormalPerformance
  | IBetaPerformance
  | IGammaPerformance
  | ISurvivalPerformance
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
  | 'dt'
  | 'dsurv';
