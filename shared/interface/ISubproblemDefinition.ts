export default interface ISubproblemDefinition {
  ranges: Record<string, [number, number]>;
  excludedCriteria: string[];
  excludedAlternatives: string[];
  excludedDataSources: string[];
}
