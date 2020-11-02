import IRelativeCovarianceMatrix from './IRelativeCovarianceMatrix';

export interface IProblemRelativePerformance {
  distribution: TRelativePerformance;
}

export type TRelativePerformance = IRelativeLogitNormal; //TODO add other types

interface IRelativeLogitNormal {
  type: 'relative-logit-normal';
  parameters: {
    baseline: {type: 'dnorm'; name: string; mu: number; sigma: number};
    relative: IRelative;
  };
}

export interface IRelative {
  type: 'dmnorm';
  mu: Record<string, number>; //alternativeid, value
  cov: IRelativeCovarianceMatrix;
}
