import IPvf from '../Problem/IPvf';

export interface IPieceWiseLinearPvf extends IPvf {
  type: 'piecewise-linear';
  cutoffs: number[];
  values: number[];
}
