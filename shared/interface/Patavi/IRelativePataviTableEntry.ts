import {TRelativePerformance} from '../Problem/IProblemRelativePerformance';
import {IRelativePerformanceTableEntry} from '../Problem/IRelativePerformanceTableEntry';

export interface IRelativePataviTableEntry
  extends Omit<IRelativePerformanceTableEntry, 'performance'> {
  performance: TRelativePerformance;
}
