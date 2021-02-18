import {IAbsolutePataviTableEntry} from './IAbsolutePataviTableEntry';
import {IRelativePataviTableEntry} from './IRelativePataviTableEntry';

export type TPataviPerformanceTableEntry =
  | IRelativePataviTableEntry
  | IAbsolutePataviTableEntry;
