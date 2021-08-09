import {TPreferences} from '@shared/types/preferences';
import IMcdaScenario from '../Scenario/IMcdaScenario';
import {IPataviProblem} from './IPataviProblem';

export interface IWeightsProblem
  extends Omit<IPataviProblem, 'performanceTable' | 'weights'> {
  method: 'representativeWeights';
  seed: number;
  preferences: TPreferences;
}

export interface IWeightsCommand {
  problem: IWeightsProblem;
  scenario: IMcdaScenario;
}
