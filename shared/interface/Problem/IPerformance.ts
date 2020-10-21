import {DistributionPerformance} from './IDistributionPerformance';
import {EffectPerformance} from './IEffectPerformance';
import {IProblemRelativePerformance} from './IProblemRelativePerformance';

export type Performance =
  | IDualPerformance
  | IEffectPerformance
  | IDistributionPerformance
  | IProblemRelativePerformance;

export interface IDualPerformance {
  effect: EffectPerformance;
  distribution: DistributionPerformance;
}

export interface IEffectPerformance {
  effect: EffectPerformance;
}

export interface IDistributionPerformance {
  distribution: DistributionPerformance;
}
