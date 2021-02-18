import {IProblemRelativePerformance} from './IProblemRelativePerformance';

export interface IRelativePerformanceTableEntry {
  criterion: string;
  dataSource: string;
  performance: IProblemRelativePerformance;
}
