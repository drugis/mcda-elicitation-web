import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import IRelativePerformance from '@shared/interface/IRelativePerformance';
import IWorkspace from '@shared/interface/IWorkspace';

export default interface ISubproblemContext {
  filteredAlternatives: IAlternative[];
  filteredCriteria: ICriterion[];
  filteredEffects: Effect[];
  filteredDistributions: Distribution[];
  filteredRelativePerformances: IRelativePerformance[];
  filteredWorkspace: IWorkspace;
  observedRanges: Record<string, [number, number]>;
}
