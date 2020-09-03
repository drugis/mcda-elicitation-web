import IElicitationCriterion from '../Interface/IElicitationCriterion';

export default interface IMatchingElicitationContext {
  criteria: Map<string, IElicitationCriterion>;
  currentStep: number;
  elicitationMethod: string;
  isNextDisabled: boolean;
  mostImportantCriterion: IElicitationCriterion;
  cancel: () => void;
  setCurrentStep: (newStep: number) => void;
  save: (preferences: any) => void;
  setIsNextDisabled: (isNextDisabled: boolean) => void;
  setMostImportantCriterion: (criterion: IElicitationCriterion) => void;
  setImportance: (criterionId: string, importance: number) => void;
}
