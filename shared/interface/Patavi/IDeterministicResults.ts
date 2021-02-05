import IWeights from '@shared/interface/Scenario/IWeights';

export interface IDeterministicResults {
  total: Record<string, number>;
  value: Record<string, Record<string, number>>;
  weights: IWeights;
}
