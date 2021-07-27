import {TPreferences} from '@shared/types/Preferences';
import IWeights from '../IWeights';
import IScenarioProblem from './IScenarioProblem';

export default interface IScenarioState {
  problem: IScenarioProblem;
  prefs: TPreferences;
  legend?: Record<string, {baseTitle: string; newTitle: string}>;
  uncertaintyOptions?: Record<string, boolean>;
  weights?: IWeights;
  thresholdValuesByCriterion: Record<string, number>;
}
