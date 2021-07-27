import {TPreferences} from '@shared/types/Preferences';
import IAlternative from '../IAlternative';
import IWeights from '../Scenario/IWeights';
import {IPataviCriterion} from './IPataviCriterion';
import {TPataviPerformanceTableEntry} from './TPataviPerfomanceTableEntry';

export interface IPataviProblem {
  alternatives: Record<string, IAlternative>;
  criteria: Record<string, IPataviCriterion>;
  preferences: TPreferences;
  performanceTable: TPataviPerformanceTableEntry[];
  weights: IWeights;
}
