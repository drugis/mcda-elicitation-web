import {IPataviProblem} from './IPataviProblem';

export interface ISmaaResultsCommand extends IPataviProblem {
  method: 'smaa';
  schemaVersion: string;
  seed: number;
  uncertaintyOptions: Record<string, boolean>;
}
