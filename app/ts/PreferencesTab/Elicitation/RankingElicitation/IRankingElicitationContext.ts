import IOrdinalRanking from '../Interface/IOrdinalRanking';
import IRankingAnswer from '../Interface/IRankingAnswer';

export default interface IRankingElicitationContext {
  currentStep: number;
  rankings: Record<string, IRankingAnswer>;
  setCurrentStep: (newStep: number) => void;
  setRanking: (criterionId: string, ranking: number) => void;
}
