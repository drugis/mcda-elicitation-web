import {TEffectPerformance} from './IEffectPerformance';
import {TDistributionPerformance} from './TDistributionPerformance';

export type TPerformance =
  | IDualPerformance
  | IEffectPerformance
  | IDistributionPerformance;

export interface IDualPerformance {
  effect: TEffectPerformance;
  distribution: TDistributionPerformance;
}

export interface IEffectPerformance {
  effect: TEffectPerformance;
}

export interface IDistributionPerformance {
  distribution: TDistributionPerformance;
}
