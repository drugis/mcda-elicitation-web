import IPerformance from './IPerformance';

export interface IPerformanceTableEntry {
  alternative: string;
  criterion: string;
  dataSource: string;
  performance: IPerformance;
}
