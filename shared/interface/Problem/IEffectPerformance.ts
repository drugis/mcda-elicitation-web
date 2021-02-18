import IEmptyPerformance from './IEmptyPerformance';
import IRangeEffectPerformance from './IRangeEffectPerformance';
import ITextPerformance from './ITextPerformance';
import IValueCIPerformance from './IValueCIPerformance';
import IValuePerformance from './IValuePerformance';

export type TEffectPerformance =
  | IValuePerformance
  | IValueCIPerformance
  | IRangeEffectPerformance
  | ITextPerformance
  | IEmptyPerformance;

export type TEffectPerformanceType = 'exact' | 'empty';
