import {TPvfDirection} from '@shared/types/TPvfDirection';
import IPvf from '../Problem/IPvf';

export interface IPieceWiseLinearPvf extends IPvf {
  type: 'piecewise-linear';
  direction: TPvfDirection;
  cutoffs: number[];
  values: number[];
}
