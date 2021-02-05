import {IPataviProblem} from './IPataviProblem';

export interface IDeterministicResultsCommand extends IPataviProblem {
  method: 'deterministic';
  schemaVersion: string;
}
