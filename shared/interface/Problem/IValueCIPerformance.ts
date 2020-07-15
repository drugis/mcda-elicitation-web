import IValuePerformance from './IValuePerformance';

export default interface IValueCIPerformance extends IValuePerformance {
  input: {
    value: number;
    lowerBound: number | 'NE';
    upperBound: number | 'NE';
  };
}
