import {Performance} from './IPerformance';

export interface IPerformanceTableEntry {
  alternative: string;
  criterion: string;
  dataSource: string;
  performance: Performance;
}
