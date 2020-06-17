import {distributionType} from './IDistribution';

export default interface IDistributionCellContext {
  alternativeId: string;
  inputType: distributionType;
  value: string;
  isValidValue: boolean;
  lowerBound: string;
  isValidLowerBound: boolean;
  upperBound: string;
  isValidUpperBound: boolean;
  text: string;
  mean: string;
  isValidMean: boolean;
  standardError: string;
  isValidStandardError: boolean;
  alpha: string;
  isValidAlpha: boolean;
  beta: string;
  isValidBeta: boolean;
  setInputType: (inputType: distributionType) => void;
  setValue: (value: string) => void;
  setIsValidValue: (isValid: boolean) => void;
  setLowerBound: (lowerBound: string) => void;
  setIsValidLowerBound: (isValid: boolean) => void;
  setUpperBound: (upperBound: string) => void;
  setIsValidUpperBound: (isValid: boolean) => void;
  setText: (text: string) => void;
  setMean: (mean: string) => void;
  setIsValidMean: (isValid: boolean) => void;
  setStandardError: (standardError: string) => void;
  setIsValidStandardError: (isValid: boolean) => void;
  setAlpha: (alpha: string) => void;
  setIsValidAlpha: (isValid: boolean) => void;
  setBeta: (beta: string) => void;
  setIsValidBeta: (isValid: boolean) => void;
}
