import {effectType} from './IEffect';

export default interface IEffectCellContext {
  inputType: effectType;
  value: number;
  lowerBound: number;
  upperBound: number;
  text: string;
  isEditDisabled: boolean;
  setInputType: (inputType: effectType) => void;
  setValue: (value: number) => void;
  setLowerBound: (lowerBound: number) => void;
  setUpperBound: (upperBound: number) => void;
  setText: (text: string) => void;
  setIsEditDisabled: (isEditDisabled: boolean) => void;
  validateInput: () => void;
}
