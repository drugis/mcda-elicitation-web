import IEffect from "./IEffect";

export default interface IRangeEffect extends IEffect {
  lowerBound: number;
  upperBound: number;
}
