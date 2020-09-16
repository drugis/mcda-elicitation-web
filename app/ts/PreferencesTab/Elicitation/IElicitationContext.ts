import IExactSwingRatio from './Interface/IExactSwingRatio';
import {TElicitationMethod} from './Interface/IPreference';
import IRatioBound from './Interface/IRatioBound';

export default interface IElicitationContext {
  currentStep: number;
  isNextDisabled: boolean;
  mostImportantCriterionId: string;
  preferences: Record<string, IExactSwingRatio> | Record<string, IRatioBound>;
  elicitationMethod: TElicitationMethod;
  setCurrentStep: (newStep: number) => void;
  setIsNextDisabled: (isNextDisabled: boolean) => void;
  setMostImportantCriterionId: (criterionId: string) => void;
  setPreference: (criterionId: string, preference: number) => void;
  setBoundPreference: (
    criterionId: string,
    preference: [number, number]
  ) => void;
  setPreferences: (
    preferences: Record<string, IExactSwingRatio> | Record<string, IRatioBound>
  ) => void;
}
