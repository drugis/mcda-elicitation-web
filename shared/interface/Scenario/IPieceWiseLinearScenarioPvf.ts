import {TPvfDirection} from '@shared/types/TPvfDirection';

export default interface IPieceWiseLinearScenarioPvf {
  direction: TPvfDirection;
  type: 'piecewise-linear';
  cutoffs: number[];
  values: number[];
}
