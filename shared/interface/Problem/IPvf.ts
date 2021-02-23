import {TPvfDirection} from '@shared/types/TPvfDirection';
import {ILinearPvf} from '../Pvfs/ILinearPvf';
import {IPieceWiseLinearPvf} from '../Pvfs/IPieceWiseLinearPvf';

export type TPvf = ILinearPvf | IPieceWiseLinearPvf;

export default interface IPvf {
  direction: TPvfDirection;
  range: [number, number];
}
