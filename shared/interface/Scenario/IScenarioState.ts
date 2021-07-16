import {TPreferences} from '@shared/types/Preferences';
import IScenarioProblem from './IScenarioProblem';
import IWeights from './IWeights';

export default interface IScenarioState {
  problem: IScenarioProblem;
  prefs: TPreferences;
  legend?: Record<string, {baseTitle: string; newTitle: string}>;
  uncertaintyOptions?: Record<string, boolean>;
  weights?: IWeights;
  thresholdValuesByCriterion: Record<string, number>;
}
