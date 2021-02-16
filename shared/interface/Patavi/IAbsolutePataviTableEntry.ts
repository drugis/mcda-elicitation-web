import {TEffectPerformance} from '../Problem/IEffectPerformance';
import {IAbsolutePerformanceTableEntry} from '../Problem/IAbsolutePerformanceTableEntry';
import {TDistributionPerformance} from '../Problem/TDistributionPerformance';

export interface IAbsolutePataviTableEntry
  extends Omit<IAbsolutePerformanceTableEntry, 'performance'> {
  performance: TEffectPerformance | TDistributionPerformance;
}
