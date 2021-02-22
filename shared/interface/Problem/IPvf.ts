import {ILinearPvf} from '../Pvfs/ILinearPvf';
import {IPieceWiseLinearPvf} from '../Pvfs/IPieceWiseLinearPvf';

export type TPvf = ILinearPvf | IPieceWiseLinearPvf;

export default interface IPvf {
  range: [number, number];
}
