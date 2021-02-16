import {TPreferences} from '@shared/types/Preferences';
import IAlternative from '../IAlternative';
import {IPerformanceTableEntry} from './IPerformanceTableEntry';
import IProblemCriterion from './IProblemCriterion';
import {IRelativePerformanceTableEntry} from './IRelativePerformanceTableEntry';

export default interface IProblem {
  schemaVersion: string;
  title: string;
  description: string;
  criteria: Record<string, IProblemCriterion>;
  alternatives: Record<string, IAlternative>;
  performanceTable: (IRelativePerformanceTableEntry | IPerformanceTableEntry)[];
  preferences?: TPreferences;
}
