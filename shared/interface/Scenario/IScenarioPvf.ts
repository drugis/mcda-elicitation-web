import {TPvfDirection, TPvfType} from '@shared/types/PvfTypes';

export default interface IScenarioPvf {
  direction: TPvfDirection;
  type: TPvfType;
  cutoffs?: number[];
  values?: number[];
}
