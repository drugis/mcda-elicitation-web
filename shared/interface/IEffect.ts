import IEmptyEffect from './IEmptyEffect';
import IRangeEffect from './IRangeEffect';
import ITextEffect from './ITextEffect';
import {UnitOfMeasurementType} from './IUnitOfMeasurement';
import IValueCIEffect from './IValueCIEffect';
import IValueEffect from './IValueEffect';

export type Effect =
  | IValueEffect
  | IValueCIEffect
  | IRangeEffect
  | ITextEffect
  | IEmptyEffect;

export type effectType = 'value' | 'valueCI' | 'range' | 'empty' | 'text';

export default interface IEffect {
  alternativeId: string;
  dataSourceId: string;
  criterionId: string;
  unitOfMeasurementType?: UnitOfMeasurementType;
}
