import {EffectPerformance} from '../Problem/IEffectPerformance';
import {IPerformanceTableEntry} from '../Problem/IPerformanceTableEntry';
import {TDistributionPerformance} from '../Problem/TDistributionPerformance';

export interface IAbsolutePataviTableEntry
  extends Omit<IPerformanceTableEntry, 'performance'> {
  performance: EffectPerformance | TDistributionPerformance;
}
