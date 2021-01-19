import {TPreferences} from '@shared/types/Preferences';
import IMcdaScenario from '../Scenario/IMcdaScenario';
import {IPataviProblem} from './IPataviProblem';

export interface IWeightsProblem extends IPataviProblem {
  method: 'representativeWeights';
  schemaVersion: string;
  seed: number;
  preferences: TPreferences;
}

export interface IWeightsCommand {
  problem: IWeightsProblem;
  scenario: IMcdaScenario;
}
