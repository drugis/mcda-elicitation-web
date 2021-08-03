import IWeights from '../IWeights';
import {ICentralWeight} from './ICentralWeight';

export interface ISmaaResults {
  cw: Record<string, ICentralWeight>;
  ranks: Record<string, number[]>;
  weightsQuantiles: IWeights;
}
