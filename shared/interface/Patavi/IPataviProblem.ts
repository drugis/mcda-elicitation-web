import IProblem from '../Problem/IProblem';
import {IAbsolutePataviTableEntry} from './IAbsolutePataviTableEntry';
import {IPataviCriterion} from './IPataviCriterion';
import {IRelativePataviTableEntry} from './IRelativePataviTableEntry';

export interface IPataviProblem
  extends Omit<IProblem, 'criteria' | 'performanceTable'> {
  criteria: Record<string, IPataviCriterion>;
  schemaVersion: string;
  performanceTable: (IRelativePataviTableEntry | IAbsolutePataviTableEntry)[];
}
