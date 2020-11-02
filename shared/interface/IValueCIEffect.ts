import {IEffectWithValue} from './IEffectWithValue';

export default interface IValueCIEffect extends IEffectWithValue {
  type: 'valueCI';
  lowerBound: number;
  upperBound: number;
  isNotEstimableLowerBound: boolean;
  isNotEstimableUpperBound: boolean;
}
