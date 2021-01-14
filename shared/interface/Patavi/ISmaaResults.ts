import IWeights from '@shared/interface/Scenario/IWeights';
import {ICentralWeight} from './ICentralWeight';

export interface ISmaaResults {
  cw: Record<string, ICentralWeight>;
  ranks: Record<string, number[]>;
  weightsQuantiles: IWeights;
}
