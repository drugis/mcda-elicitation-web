import IExactSwingRatio from './Interface/IExactSwingRatio';

export default interface IElicitationContext {
  currentStep: number;
  isNextDisabled: boolean;
  mostImportantCriterionId: string;
  preferences: Record<string, IExactSwingRatio>;
  cancel: () => void;
  setCurrentStep: (newStep: number) => void;
  save: (preferences: IExactSwingRatio[]) => void;
  setIsNextDisabled: (isNextDisabled: boolean) => void;
  setMostImportantCriterionId: (criterionId: string) => void;
  setPreference: (criterionId: string, preference: number) => void;
  setPreferences: (preferences: Record<string, IExactSwingRatio>) => void;
}
