import IProblem from '../Problem/IProblem';
import {IPataviCriterion} from './IPataviCriterion';
import {IPataviTableEntry} from './IPataviTableEntry';

export interface IPataviProblem
  extends Omit<IProblem, 'criteria' | 'performanceTable'> {
  criteria: Record<string, IPataviCriterion>;
  schemaVersion: string;
  performanceTable: IPataviTableEntry[];
}
