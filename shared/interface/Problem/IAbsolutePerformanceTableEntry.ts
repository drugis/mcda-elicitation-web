import {TPerformance} from './IPerformance';

export interface IAbsolutePerformanceTableEntry {
  alternative: string;
  criterion: string;
  dataSource: string;
  performance: TPerformance;
}
