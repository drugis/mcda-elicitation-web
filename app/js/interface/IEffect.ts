import IValueEffect from './IValueEffect';
import IValueCIEffect from './IValueCIEffect';
import IRangeEffect from './IRangeEffect';
import ITextEffect from './ITextEffect';
import IEmptyEffect from './IEmptyEffect';
export type Effect =
  | IValueEffect
  | IValueCIEffect
  | IRangeEffect
  | ITextEffect
  | IEmptyEffect;

export type effectType = 'value' | 'valueCI' | 'range' | 'empty' | 'text';

export default interface IEffect {
  type: effectType;
  alternativeId: string;
  dataSourceId: string;
  criterionId: string;
}
