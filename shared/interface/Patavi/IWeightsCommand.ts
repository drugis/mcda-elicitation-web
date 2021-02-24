import {TPreferences} from '@shared/types/Preferences';
import IMcdaScenario from '../Scenario/IMcdaScenario';
import {IPataviProblem} from './IPataviProblem';

export interface IWeightsProblem
  extends Omit<IPataviProblem, 'performanceTable'> {
  method: 'representativeWeights';
  seed: number;
  preferences: TPreferences;
}

export interface IWeightsCommand {
  problem: IWeightsProblem;
  scenario: IMcdaScenario;
}
