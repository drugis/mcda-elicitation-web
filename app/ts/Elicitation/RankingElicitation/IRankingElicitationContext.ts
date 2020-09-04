import IElicitationCriterion from '../Interface/IElicitationCriterion';
import IOrdinalRanking from '../Interface/IOrdinalRanking';

export default interface IRankingElicitationContext {
  criteria: Map<string, IElicitationCriterion>;
  currentStep: number;
  cancel: () => void;
  setCurrentStep: (newStep: number) => void;
  setRanking: (criterionId: string, ranking: number) => void;
  save: (preferences: IOrdinalRanking[]) => void;
}
