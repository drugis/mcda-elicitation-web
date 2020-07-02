import {TableInputMode} from '../../app/ts/type/TableInputMode';
import {distributionType} from './IDistribution';
import {effectType} from './IEffect';

export default interface IDatabaseInputCell {
  inprogressworkspaceid: number;
  alternativeid: string;
  datasourceid: string;
  criterionid: string;
  val: number | null;
  lowerbound: number | null;
  upperbound: number | null;
  isnotestimablelowerbound: boolean | null;
  isnotestimableupperbound: boolean | null;
  txt: string | null;
  mean: number | null;
  standarderror: number | null;
  alpha: number | null;
  beta: number | null;
  celltype: TableInputMode;
  inputtype: effectType | distributionType;
}
