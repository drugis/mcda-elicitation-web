import {TPvfDirection} from '@shared/types/PvfTypes';
import IPvf from '../Problem/IPvf';

export interface IPieceWiseLinearPvf extends IPvf {
  type: 'piece-wise-linear';
  direction: TPvfDirection;
  cutoffs: number[];
  values: number[];
}
