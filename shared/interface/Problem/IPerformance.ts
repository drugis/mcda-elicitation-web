import {EffectPerformance} from './IEffectPerformance';
import {IProblemRelativePerformance} from './IProblemRelativePerformance';
import {TDistributionPerformance} from './TDistributionPerformance';

export type TPerformance =
  | IDualPerformance
  | IEffectPerformance
  | IDistributionPerformance
  | IProblemRelativePerformance;

export interface IDualPerformance {
  effect: EffectPerformance;
  distribution: TDistributionPerformance;
}

export interface IEffectPerformance {
  effect: EffectPerformance;
}

export interface IDistributionPerformance {
  distribution: TDistributionPerformance;
}
