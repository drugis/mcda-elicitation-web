import {effectType} from './IEffect';

export default interface IEffectCellContext {
  alternativeId: string;
  inputType: effectType;
  value: string;
  isValidValue: boolean;
  lowerBound: string;
  isValidLowerBound: boolean;
  upperBound: string;
  isValidUpperBound: boolean;
  text: string;
  setInputType: (inputType: effectType) => void;
  setValue: (value: string) => void;
  setIsValidValue: (isValid: boolean) => void;
  setLowerBound: (lowerBound: string) => void;
  setIsValidLowerBound: (isValid: boolean) => void;
  setUpperBound: (upperBound: string) => void;
  setIsValidUpperBound: (isValid: boolean) => void;
  setText: (text: string) => void;
}
