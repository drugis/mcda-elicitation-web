import {TableInputMode} from '../../app/ts/type/TableInputMode';
import {distributionType} from './IDistribution';
import {effectType} from './IEffect';

export default interface ICellCommand {
  alternativeId: string;
  dataSourceId: string;
  criterionId: string;
  cellType: TableInputMode;
  inProgressWorkspaceId: number;
  type: effectType | distributionType;
  value?: number;
  lowerBound?: number;
  upperBound?: number;
  isNotEstimableLowerBound?: boolean;
  isNotEstimableUpperBound?: boolean;
  text?: string;
  mean?: number;
  standardError?: number;
  alpha?: number;
  beta?: number;
}
