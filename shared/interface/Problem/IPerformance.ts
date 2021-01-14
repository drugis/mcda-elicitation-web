import {TDistributionPerformance} from './TDistributionPerformance';
import {EffectPerformance} from './IEffectPerformance';
import {IProblemRelativePerformance} from './IProblemRelativePerformance';

export type Performance =
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
