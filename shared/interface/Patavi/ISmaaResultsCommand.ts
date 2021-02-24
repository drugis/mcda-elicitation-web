import {IPataviProblem} from './IPataviProblem';

export interface ISmaaResultsCommand extends IPataviProblem {
  method: 'smaa';
  seed: number;
  uncertaintyOptions: Record<string, boolean>;
}
