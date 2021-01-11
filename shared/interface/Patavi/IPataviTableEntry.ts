import {DistributionPerformance} from '../Problem/IDistributionPerformance';
import {EffectPerformance} from '../Problem/IEffectPerformance';
import {IPerformanceTableEntry} from '../Problem/IPerformanceTableEntry';
import {TRelativePerformance} from '../Problem/IProblemRelativePerformance';

export interface IPataviTableEntry
  extends Omit<IPerformanceTableEntry, 'performance'> {
  performance:
    | EffectPerformance
    | DistributionPerformance
    | TRelativePerformance;
}
