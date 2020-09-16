import {TPvfDirection, TPvfType} from '@shared/types/PvfTypes';

export default interface IPvf {
  range: [number, number];
  direction?: TPvfDirection;
  type?: TPvfType;
  cutoffs?: number[];
  values?: number[];
}
