import IElicitationCriterion from './Interface/IElicitationCriterion';
import IExactSwingRatio from './Interface/IExactSwingRatio';

export default interface IElicitationContext {
  criteria: Map<string, IElicitationCriterion>;
  currentStep: number;
  isNextDisabled: boolean;
  mostImportantCriterion: IElicitationCriterion;
  cancel: () => void;
  setCurrentStep: (newStep: number) => void;
  save: (preferences: IExactSwingRatio[]) => void;
  setIsNextDisabled: (isNextDisabled: boolean) => void;
  setMostImportantCriterion: (criterion: IElicitationCriterion) => void;
  setImportance: (criterionId: string, importance: number) => void;
}
