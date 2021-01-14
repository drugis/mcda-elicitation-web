import IProblem from '../Problem/IProblem';
import {IPataviCriterion} from './IPataviCriterion';
import {IPataviTableEntry} from './IPataviTableEntry';

type TPataviMethod = 'smaa';

export interface ISmaaResultsCommand
  extends Omit<IProblem, 'criteria' | 'performanceTable'> {
  criteria: Record<string, IPataviCriterion>;
  method: TPataviMethod;
  schemaVersion: string;
  seed: number;
  uncertaintyOptions: Record<string, boolean>;
  performanceTable: IPataviTableEntry[];
}
