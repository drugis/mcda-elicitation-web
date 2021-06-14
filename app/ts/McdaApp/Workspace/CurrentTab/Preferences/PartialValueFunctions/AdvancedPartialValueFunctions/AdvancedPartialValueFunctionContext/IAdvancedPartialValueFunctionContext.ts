import ICriterion from '@shared/interface/ICriterion';
import {TPvfDirection} from '@shared/types/TPvfDirection';

export interface IAdvancedPartialValueFunctionContext {
  advancedPvfCriterion: ICriterion;
  configuredRange: [number, number];
  cutoffs: [number, number, number];
  cutoffsByValue: Record<number, number>;
  direction: TPvfDirection;
  isSaveDisabled: boolean;
  usePercentage: boolean;
  setCutoffs: (cutoffs: [number, number, number]) => void;
  setDirection: (direction: TPvfDirection) => void;
}
