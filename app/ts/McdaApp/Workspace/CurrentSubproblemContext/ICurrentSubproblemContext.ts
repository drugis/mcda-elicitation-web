import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IRelativePerformance from '@shared/interface/IRelativePerformance';
import IWorkspace from '@shared/interface/IWorkspace';

export default interface ICurrentSubproblemContext {
  configuredRanges: Record<string, [number, number]>;
  currentSubproblem: IOldSubproblem;
  filteredAlternatives: IAlternative[];
  filteredCriteria: ICriterion[];
  filteredEffects: Effect[];
  filteredDistributions: Distribution[];
  filteredRelativePerformances: IRelativePerformance[];
  filteredWorkspace: IWorkspace;
  observedRanges: Record<string, [number, number]>;
  editSubproblem: (subproblem: IOldSubproblem) => void;
  getCriterion: (id: string) => ICriterion;
  getConfiguredRange: (criterion: ICriterion) => [number, number];
  getStepSizeForCriterion: (criterion: ICriterion) => number;
  setCurrentSubproblem: (newSubproblem: IOldSubproblem) => void;
}
