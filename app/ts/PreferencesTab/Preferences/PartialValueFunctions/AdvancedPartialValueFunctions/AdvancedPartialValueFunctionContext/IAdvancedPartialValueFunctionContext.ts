import ICriterion from '@shared/interface/ICriterion';
import {TPvfDirection} from '@shared/types/PvfTypes';

export interface IAdvancedPartialValueFunctionContext {
  advancedPvfCriterion: ICriterion;
  cutOffs: [number, number, number];
  direction: TPvfDirection;
  values: [number, number, number];
  setCutOffs: (cutOffs: [number, number, number]) => void;
  setDirection: (direction: TPvfDirection) => void;
  setValues: (values: [number, number, number]) => void;
}
