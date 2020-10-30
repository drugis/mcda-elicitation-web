import IAlternative from '@shared/interface/IAlternative';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';

export default interface ISubproblemContext {
  filteredAlternatives: Record<string, IAlternative>;
  filteredCriteria: Record<string, IProblemCriterion>;
  filteredPerformanceTable: IPerformanceTableEntry[];
  filteredWorkspace: IOldWorkspace;
}
