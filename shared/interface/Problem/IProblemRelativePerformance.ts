import {TRelativePerformanceType} from '../IRelativePerformance';
import IBaseline from './IBaseline';
import IRelativeCovarianceMatrix from './IRelativeCovarianceMatrix';

export interface IProblemRelativePerformance {
  distribution: TRelativePerformance;
}

export type TRelativePerformance = IRelativeLogitNormal;

interface IRelativeLogitNormal {
  type: TRelativePerformanceType;
  parameters: {
    baseline: IBaseline;
    relative: IRelative;
  };
}

export interface IRelative {
  type: 'dmnorm';
  mu: Record<string, number>; //alternativeid, value
  cov: IRelativeCovarianceMatrix;
}
