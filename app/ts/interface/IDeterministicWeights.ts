import IWeights from '@shared/interface/Scenario/IWeights';
import IChangeableValue from './IChangeableValue';

export default interface IDeterministicWeights {
  weights: IWeights;
  importances: Record<string, IChangeableValue>;
  equivalentChanges: Record<string, IChangeableValue>;
  partOfInterval: number;
}
