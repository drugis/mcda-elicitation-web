import {TPvfType, TPvfDirection} from '@shared/types/PvfTypes';

export default interface IPvf {
  direction: TPvfDirection;
  type: TPvfType;
  cutoffs?: number[];
  values?: number[];
  range?: [number, number];
}
