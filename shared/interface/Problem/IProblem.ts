import {IPerformanceTableEntry} from './IPerformanceTableEntry';
import IProblemCriterion from './IProblemCriterion';
import {TPreferences} from '@shared/types/Preferences';

export default interface IProblem {
  schemaVersion: string;
  title: string;
  description: string;
  criteria: Record<string, IProblemCriterion>;
  alternatives: Record<string, {title: string}>;
  performanceTable: IPerformanceTableEntry[];
  preferences?: TPreferences;
}
