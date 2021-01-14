import IBetaDistribution from './IBetaDistribution';
import IEmptyEffect from './IEmptyEffect';
import IGammaDistribution from './IGammaDistribution';
import INormalDistribution from './INormalDistribution';
import IRangeEffect from './IRangeEffect';
import IStudentsTDistribution from './IStudentsTDistribution';
import ITextEffect from './ITextEffect';
import {UnitOfMeasurementType} from './IUnitOfMeasurement';
import IValueEffect from './IValueEffect';

export type Distribution =
  | INormalDistribution
  | IBetaDistribution
  | IGammaDistribution
  | IStudentsTDistribution
  | IValueEffect
  | IRangeEffect
  | IEmptyEffect
  | ITextEffect;

export type distributionType =
  | 'normal'
  | 'beta'
  | 'gamma'
  | 'dt'
  | 'value'
  | 'range'
  | 'empty'
  | 'text';

export default interface IDistribution {
  alternativeId: string;
  dataSourceId: string;
  criterionId: string;
  unitOfMeasurementType?: UnitOfMeasurementType;
}
