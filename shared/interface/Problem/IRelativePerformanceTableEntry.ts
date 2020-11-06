import IRelativePerformance from '../IRelativePerformance';

export interface IRelativePerformanceTableEntry {
  criterion: string;
  dataSource: string;
  performance: IRelativePerformance;
}
