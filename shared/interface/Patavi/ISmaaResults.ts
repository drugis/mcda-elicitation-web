import IWeights from '@shared/interface/Scenario/IWeights';

export interface ISmaaResults {
  cw: Record<string, {cf: number; w: Record<string, number>}>;
  ranks: Record<string, Record<number, number>>;
  weightsQuantiles: IWeights;
}
