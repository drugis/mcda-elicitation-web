import {TableInputMode} from '../type/TableInputMode';
import {distributionType} from './IDistribution';
import {effectType} from './IEffect';

export default interface IInputCellQueryResult {
  inprogressworkspaceid: number;
  alternativeid: string;
  datasourceid: string;
  criterionid: string;
  val: number;
  lowerbound: number;
  upperbound: number;
  isnotestimablelowerbound: boolean;
  isnotestimableupperbound: boolean;
  txt: string;
  mean: number;
  standarderror: number;
  alpha: number;
  beta: number;
  celltype: TableInputMode;
  inputtype: effectType | distributionType;
}
