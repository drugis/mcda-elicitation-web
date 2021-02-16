import {IAbsolutePerformanceTableEntry} from './IAbsolutePerformanceTableEntry';
import {IRelativePerformanceTableEntry} from './IRelativePerformanceTableEntry';

export type TPerformanceTableEntry =
  | IRelativePerformanceTableEntry
  | IAbsolutePerformanceTableEntry;
