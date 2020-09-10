import IExactSwingRatio from './Interface/IExactSwingRatio';
import {ElicitationMethod} from './Interface/IPreference';
import IRatioBound from './Interface/IRatioBound';

export default interface IElicitationContext {
  currentStep: number;
  isNextDisabled: boolean;
  mostImportantCriterionId: string;
  preferences: Record<string, IExactSwingRatio | IRatioBound>;
  elicitationMethod: ElicitationMethod;
  cancel: () => void;
  setCurrentStep: (newStep: number) => void;
  save: (preferences: (IRatioBound | IExactSwingRatio)[]) => void;
  setIsNextDisabled: (isNextDisabled: boolean) => void;
  setMostImportantCriterionId: (criterionId: string) => void;
  setPreference: (criterionId: string, preference: number) => void;
  setBoundPreference: (
    criterionId: string,
    preference: [number, number]
  ) => void;
  setPreferences: (
    preferences: Record<string, IExactSwingRatio | IRatioBound>
  ) => void;
}
