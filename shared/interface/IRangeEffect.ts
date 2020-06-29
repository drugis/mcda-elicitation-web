import IEffect from './IEffect';

export default interface IRangeEffect extends IEffect {
  type: 'range';
  lowerBound: number;
  upperBound: number;
}
