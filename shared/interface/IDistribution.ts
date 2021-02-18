import IBetaDistribution from './IBetaDistribution';
import IEmptyEffect from './IEmptyEffect';
import IGammaDistribution from './IGammaDistribution';
import INormalDistribution from './INormalDistribution';
import IRangeEffect from './IRangeEffect';
import IStudentsTDistribution from './IStudentsTDistribution';
import ISurvivalDistribution from './ISurvivalDistribution';
import ITextEffect from './ITextEffect';
import {UnitOfMeasurementType} from './IUnitOfMeasurement';
import IValueEffect from './IValueEffect';

export type Distribution =
  | INormalDistribution
  | IBetaDistribution
  | IGammaDistribution
  | IStudentsTDistribution
  | ISurvivalDistribution
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
  | 'text'
  | 'survival';

export default interface IDistribution {
  alternativeId: string;
  dataSourceId: string;
  criterionId: string;
  unitOfMeasurementType?: UnitOfMeasurementType;
}
