import IValuePerformance from './IValuePerformance';

export default interface IRangeEffectPerformance extends IValuePerformance {
  input: {
    lowerBound: number;
    upperBound: number;
  };
}
