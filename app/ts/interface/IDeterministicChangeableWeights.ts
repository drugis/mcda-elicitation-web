import IChangeableValue from './IChangeableValue';

export default interface IDeterministicChangeableWeights {
  weights: Record<string, number>; // TODO consider changing this to Record<string, number>
  importances: Record<string, IChangeableValue>;
  equivalentChanges: Record<string, IChangeableValue>;
  partOfInterval: number;
}
