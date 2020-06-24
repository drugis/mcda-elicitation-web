import {TableInputMode} from '../type/TableInputMode';
import {distributionType} from './IDistribution';
import {effectType} from './IEffect';

export default interface IValueCellQueryResult {
  inprogressworkspaceid: number;
  alternativeid: string;
  datasourceid: string;
  criterionid: string;
  val: number;
  lowerbound: number;
  upperbound: number;
  txt: string;
  mean: number;
  standarderror: number;
  alpha: number;
  beta: number;
  celltype: TableInputMode;
  inputtype: effectType | distributionType;
}
