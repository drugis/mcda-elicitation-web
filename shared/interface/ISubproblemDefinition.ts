import ISubproblemRange from './ISubproblemRange';

export default interface ISubproblemDefinition {
  ranges: Record<string, ISubproblemRange>;
  excludedCriteria?: string[];
  excludedAlternatives?: string[];
  excludedDataSources?: string[];
}
