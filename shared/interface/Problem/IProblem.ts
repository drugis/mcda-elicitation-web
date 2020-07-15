import {IPerformanceTableEntry} from './IPerformanceTableEntry';
import IProblemCriterion from './IProblemCriterion';

export default interface IProblem {
  schemaVersion: string;
  title: string;
  description: string;
  criteria: Record<string, IProblemCriterion>;
  alternatives: Record<string, {title: string}>;
  performanceTable: IPerformanceTableEntry[];
  prefs?: {};
}
