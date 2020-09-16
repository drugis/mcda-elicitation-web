import IExactSwingRatio from '@shared/interface/Scenario/IExactSwingRatio';
import IRatioBoundConstraint from '@shared/interface/Scenario/IRatioBoundConstraint';
import {TElicitationMethod} from '../TElicitationMethod';

export default interface IElicitationContext {
  currentStep: number;
  isNextDisabled: boolean;
  mostImportantCriterionId: string;
  preferences:
    | Record<string, IExactSwingRatio>
    | Record<string, IRatioBoundConstraint>;
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
    preferences:
      | Record<string, IExactSwingRatio>
      | Record<string, IRatioBoundConstraint>
  ) => void;
}
