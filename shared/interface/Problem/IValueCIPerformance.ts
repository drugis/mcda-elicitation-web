import IValuePerformance from './IValuePerformance';

export default interface IValueCIPerformance extends IValuePerformance {
  input: {
    value: number;
    lowerBound: number;
    upperBound: number;
  };
}
