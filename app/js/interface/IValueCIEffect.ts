import IEffect from "./IEffect";

export default interface IValueCIEffect extends IEffect {
  value: number;
  lowerBound: number;
  upperBound: number;
}
