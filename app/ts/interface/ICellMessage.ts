import {TableInputMode} from '../type/TableInputMode';
import {distributionType} from './IDistribution';
import {effectType} from './IEffect';

export default interface ICellMessage {
  alternativeId: string;
  dataSourceId: string;
  criterionId: string;
  cellType: TableInputMode;
  inProgressWorkspaceId: number;
  type: effectType | distributionType;
  value?: number;
  lowerBound?: number;
  upperBound?: number;
  text?: string;
  mean?: number;
  standardError?: number;
  alpha?: number;
  beta?: number;
}
