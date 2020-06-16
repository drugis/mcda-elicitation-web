import IEmptyEffect from './IEmptyEffect';
import IRangeEffect from './IRangeEffect';
import ITextEffect from './ITextEffect';
import IValueCIEffect from './IValueCIEffect';
import IValueEffect from './IValueEffect';
export type Effect =
  | IValueEffect
  | IValueCIEffect
  | IRangeEffect
  | ITextEffect
  | IEmptyEffect;

export default interface IEffect {
  alternativeId: string;
  dataSourceId: string;
  criterionId: string;
}
