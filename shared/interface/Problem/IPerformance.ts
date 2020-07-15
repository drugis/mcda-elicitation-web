import {DistributionPerformance} from './IDistributionPerformance';
import {EffectPerformance} from './IEffectPerformance';

export type Performance =
  | IDualPerformance
  | IEffectPerformance
  | IDistributionPerformance;

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
