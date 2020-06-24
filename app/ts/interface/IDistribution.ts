import IBetaDistribution from './IBetaDistribution';
import IEmptyEffect from './IEmptyEffect';
import IGammaDistribution from './IGammaDistribution';
import INormalDistribution from './INormalDistribution';
import IRangeEffect from './IRangeEffect';
import ITextEffect from './ITextEffect';
import IValueEffect from './IValueEffect';

export type Distribution =
  | INormalDistribution
  | IBetaDistribution
  | IGammaDistribution
  | IValueEffect
  | IRangeEffect
  | IEmptyEffect
  | ITextEffect;

export type distributionType =
  | 'normal'
  | 'beta'
  | 'gamma'
  | 'value'
  | 'range'
  | 'empty'
  | 'text';

export default interface IDistribution {
  alternativeId: string;
  dataSourceId: string;
  criterionId: string;
}
