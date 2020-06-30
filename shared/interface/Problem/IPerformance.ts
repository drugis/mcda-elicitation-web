import {DistributionPerformance} from './IDistributionPerformance';
import {EffectPerformance} from './IEffectPerformance';

export type Performance =
  | IDualPerformance
  | IEffectPerformance
  | IDistributionPerformance;

interface IDualPerformance {
  effect: EffectPerformance;
  distribution: DistributionPerformance;
}

interface IEffectPerformance {
  effect: EffectPerformance;
}

interface IDistributionPerformance {
  distribution: DistributionPerformance;
}
