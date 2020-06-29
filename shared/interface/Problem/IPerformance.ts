import {DistributionPerformance} from './IDistributionPerformance';
import {EffectPerformance} from './IEffectPerformance';

export default interface IPerformance {
  effect: EffectPerformance;
  distribution: DistributionPerformance;
}
