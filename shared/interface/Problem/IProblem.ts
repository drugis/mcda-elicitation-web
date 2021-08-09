import {TPreferences} from '@shared/types/preferences';
import IAlternative from '../IAlternative';
import IProblemCriterion from './IProblemCriterion';
import {TPerformanceTableEntry} from './TPerformanceTableEntry';

export default interface IProblem {
  schemaVersion: string;
  title: string;
  description: string;
  criteria: Record<string, IProblemCriterion>;
  alternatives: Record<string, IAlternative>;
  performanceTable: TPerformanceTableEntry[];
  preferences?: TPreferences;
}
