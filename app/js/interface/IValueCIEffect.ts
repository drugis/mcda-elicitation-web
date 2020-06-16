import IEffect from './IEffect';

export default interface IValueCIEffect extends IEffect {
  type: 'valueCI';
  value: number;
  lowerBound: number;
  upperBound: number;
}
