import {effectType} from './IEffect';

export default interface IEffectCellContext {
  inputType: effectType;
  value: string;
  lowerBound: string;
  upperBound: string;
  text: string;
  isEditDisabled: boolean;
  setInputType: (inputType: effectType) => void;
  setValue: (value: string) => void;
  setLowerBound: (lowerBound: string) => void;
  setUpperBound: (upperBound: string) => void;
  setText: (text: string) => void;
  setIsEditDisabled: (isEditDisabled: boolean) => void;
}
