import ICriterion from '@shared/interface/ICriterion';
import {TPvfDirection} from '@shared/types/TPvfDirection';

export interface IAdvancedPartialValueFunctionContext {
  advancedPvfCriterion: ICriterion;
  cutOffs: [number, number, number];
  direction: TPvfDirection;
  isSaveDisabled: boolean;
  setCutOffs: (cutOffs: [number, number, number]) => void;
  setDirection: (direction: TPvfDirection) => void;
}
