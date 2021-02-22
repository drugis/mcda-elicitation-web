import {TPvfDirection} from '@shared/types/PvfTypes';

export default interface IPieceWiseLinearScenarioPvf {
  direction: TPvfDirection;
  type: 'piece-wise-linear';
  cutoffs: number[];
  values: number[];
}
